from __future__ import annotations

import argparse
import csv
import ipaddress
import json
import socket
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup


USER_AGENT = "XianyuServiceStudio-PublicListSample/1.0"


@dataclass(frozen=True)
class RunLimits:
    max_pages: int
    max_records: int
    delay_seconds: float
    timeout_seconds: float


def _clean(value: str) -> str:
    return " ".join(value.split())


def _origin(url: str) -> tuple[str, str, int | None]:
    parsed = urlparse(url)
    return parsed.scheme.lower(), (parsed.hostname or "").lower(), parsed.port


def _validate_http_url(url: str, label: str) -> None:
    parsed = urlparse(url)
    if (
        parsed.scheme not in {"http", "https"}
        or not parsed.hostname
        or parsed.username
        or parsed.password
    ):
        raise ValueError(f"{label}必须是完整的HTTP或HTTPS地址")


def _validate_public_http_url(url: str, label: str) -> None:
    _validate_http_url(url, label)
    hostname = urlparse(url).hostname or ""
    try:
        addresses = {
            item[4][0]
            for item in socket.getaddrinfo(
                hostname,
                None,
                family=socket.AF_UNSPEC,
                type=socket.SOCK_STREAM,
            )
        }
    except socket.gaierror as exc:
        raise ValueError(f"{label}域名无法解析") from exc
    if not addresses:
        raise ValueError(f"{label}没有可用地址")
    for raw_address in addresses:
        address = ipaddress.ip_address(raw_address)
        if not address.is_global:
            raise ValueError(f"{label}禁止访问本机、内网或非公网地址")


def _same_origin(start_url: str, target_url: str) -> bool:
    return _origin(start_url) == _origin(target_url)


def load_config(path: Path) -> dict[str, Any]:
    config = json.loads(path.read_text(encoding="utf-8"))
    required = {"start_url", "card_selector", "next_selector", "fields"}
    missing = sorted(required.difference(config))
    if missing:
        raise ValueError(f"配置缺少字段: {', '.join(missing)}")
    _validate_http_url(config["start_url"], "start_url")
    if not isinstance(config["fields"], list) or not config["fields"]:
        raise ValueError("fields必须是非空列表")
    names: set[str] = set()
    for field in config["fields"]:
        if not isinstance(field, dict) or not field.get("name") or not field.get("selector"):
            raise ValueError("每个字段都必须包含name和selector")
        if field["name"] in names:
            raise ValueError(f"字段名重复: {field['name']}")
        names.add(field["name"])
    return config


def build_robots_policy(
    session: requests.Session,
    start_url: str,
    timeout_seconds: float,
    url_validator: Any,
) -> RobotFileParser:
    parsed = urlparse(start_url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
    policy = RobotFileParser()
    policy.set_url(robots_url)
    response = safe_get(
        session,
        robots_url,
        start_url=start_url,
        timeout_seconds=timeout_seconds,
        url_validator=url_validator,
        robots=None,
    )
    if response.status_code == 404:
        policy.parse([])
        return policy
    response.raise_for_status()
    policy.parse(response.text.splitlines())
    return policy


def safe_get(
    session: requests.Session,
    url: str,
    *,
    start_url: str,
    timeout_seconds: float,
    url_validator: Any,
    robots: RobotFileParser | None,
    max_redirects: int = 5,
) -> requests.Response:
    current_url = url
    for _ in range(max_redirects + 1):
        url_validator(current_url, "请求地址")
        if not _same_origin(start_url, current_url):
            raise ValueError("拒绝跨域请求")
        if robots is not None and not robots.can_fetch(USER_AGENT, current_url):
            raise PermissionError("robots.txt不允许访问请求地址")
        response = session.get(
            current_url,
            timeout=timeout_seconds,
            headers={"User-Agent": USER_AGENT},
            allow_redirects=False,
        )
        if response.status_code not in {301, 302, 303, 307, 308}:
            return response
        location = response.headers.get("Location")
        if not location:
            raise requests.RequestException("重定向响应缺少Location")
        current_url = urljoin(current_url, location)
    raise requests.TooManyRedirects(f"重定向超过{max_redirects}次")


def extract_field(card: Any, field: dict[str, Any], page_url: str) -> str:
    node = card.select_one(field["selector"])
    if node is None:
        return ""
    attr = field.get("attr")
    if attr:
        value = node.get(attr, "")
    else:
        value = node.get_text(" ", strip=True)
    value = _clean(str(value))
    if value and field.get("absolute_url"):
        value = urljoin(page_url, value)
    return value


def _csv_safe(value: str) -> str:
    stripped = value.lstrip()
    if stripped.startswith(("=", "+", "-", "@")):
        return "'" + value
    return value


def write_outputs(
    output_dir: Path,
    fieldnames: list[str],
    rows: list[dict[str, str]],
    errors: list[dict[str, Any]],
    report: dict[str, Any],
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    with (output_dir / "products.csv").open(
        "w", encoding="utf-8-sig", newline=""
    ) as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(
            {
                field: _csv_safe(str(row.get(field, "")))
                for field in fieldnames
            }
            for row in rows
        )
    with (output_dir / "errors.jsonl").open("w", encoding="utf-8") as handle:
        for item in errors:
            handle.write(json.dumps(item, ensure_ascii=False) + "\n")
    (output_dir / "run_report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


def collect(
    config_path: Path,
    output_dir: Path,
    *,
    session: requests.Session | None = None,
    sleep_fn: Any = time.sleep,
    url_validator: Any = _validate_public_http_url,
) -> dict[str, Any]:
    config = load_config(config_path)
    limits = RunLimits(
        max_pages=max(1, min(int(config.get("max_pages", 3)), 20)),
        max_records=max(1, min(int(config.get("max_records", 1000)), 5000)),
        delay_seconds=max(1.0, min(float(config.get("delay_seconds", 1.0)), 10.0)),
        timeout_seconds=max(
            3.0, min(float(config.get("timeout_seconds", 15.0)), 60.0)
        ),
    )
    start_url = config["start_url"]
    fieldnames = [field["name"] for field in config["fields"]]
    dedupe_field = config.get("dedupe_field") or fieldnames[0]
    if dedupe_field not in fieldnames:
        raise ValueError("dedupe_field必须是fields中的字段")

    own_session = session is None
    client = session or requests.Session()
    client.trust_env = False
    client.headers.update({"User-Agent": USER_AGENT})
    started_at = datetime.now(timezone.utc)
    rows: list[dict[str, str]] = []
    errors: list[dict[str, Any]] = []
    seen_pages: set[str] = set()
    seen_keys: set[str] = set()
    duplicates = 0
    page_url: str | None = start_url
    pages_fetched = 0

    try:
        robots: RobotFileParser | None = None
        try:
            robots = build_robots_policy(
                client,
                start_url,
                limits.timeout_seconds,
                url_validator,
            )
        except Exception as exc:
            errors.append(
                {
                    "stage": "robots",
                    "url": start_url,
                    "error": f"{type(exc).__name__}: {exc}",
                }
            )
        if robots is None:
            page_url = None
        elif not robots.can_fetch(USER_AGENT, start_url):
            errors.append(
                {
                    "stage": "robots",
                    "url": start_url,
                    "error": "robots.txt不允许访问起始地址",
                }
            )
            page_url = None

        while (
            page_url
            and pages_fetched < limits.max_pages
            and len(rows) < limits.max_records
        ):
            try:
                url_validator(page_url, "分页地址")
                if not _same_origin(start_url, page_url):
                    raise ValueError("拒绝跨域分页")
            except Exception as exc:
                errors.append(
                    {
                        "stage": "pagination",
                        "url": page_url,
                        "error": f"{type(exc).__name__}: {exc}",
                    }
                )
                break
            if page_url in seen_pages:
                errors.append(
                    {
                        "stage": "pagination",
                        "url": page_url,
                        "error": "检测到分页循环",
                    }
                )
                break
            if robots is not None and not robots.can_fetch(USER_AGENT, page_url):
                errors.append(
                    {
                        "stage": "robots",
                        "url": page_url,
                        "error": "robots.txt不允许访问",
                    }
                )
                break

            try:
                response = safe_get(
                    client,
                    page_url,
                    start_url=start_url,
                    timeout_seconds=limits.timeout_seconds,
                    url_validator=url_validator,
                    robots=robots,
                )
                response.raise_for_status()
            except Exception as exc:
                errors.append(
                    {
                        "stage": "request",
                        "url": page_url,
                        "error": f"{type(exc).__name__}: {exc}",
                    }
                )
                break

            seen_pages.add(page_url)
            pages_fetched += 1
            # Let BeautifulSoup inspect the original bytes and page metadata instead
            # of trusting a possibly incorrect HTTP default encoding.
            soup = BeautifulSoup(response.content, "html.parser")
            cards = soup.select(config["card_selector"])
            if not cards:
                errors.append(
                    {
                        "stage": "parse",
                        "url": page_url,
                        "error": "未找到列表卡片",
                    }
                )
                break

            for card in cards:
                row = {
                    field["name"]: extract_field(card, field, response.url)
                    for field in config["fields"]
                }
                key = row.get(dedupe_field, "")
                if not key:
                    errors.append(
                        {
                            "stage": "record",
                            "url": page_url,
                            "error": f"去重字段为空: {dedupe_field}",
                        }
                    )
                    continue
                if key in seen_keys:
                    duplicates += 1
                    continue
                seen_keys.add(key)
                rows.append(row)
                if len(rows) >= limits.max_records:
                    break

            next_node = soup.select_one(config["next_selector"])
            next_href = next_node.get(config.get("next_attr", "href"), "") if next_node else ""
            page_url = urljoin(response.url, next_href) if next_href else None
            if page_url and pages_fetched < limits.max_pages:
                sleep_fn(limits.delay_seconds)
    finally:
        if own_session:
            client.close()

    finished_at = datetime.now(timezone.utc)
    report = {
        "status": "complete" if rows and not errors else ("partial" if rows else "failed"),
        "start_url": start_url,
        "pages_fetched": pages_fetched,
        "records": len(rows),
        "duplicates_skipped": duplicates,
        "errors": len(errors),
        "limits": {
            "max_pages": limits.max_pages,
            "max_records": limits.max_records,
            "delay_seconds": limits.delay_seconds,
        },
        "started_at_utc": started_at.isoformat(),
        "finished_at_utc": finished_at.isoformat(),
    }
    write_outputs(output_dir, fieldnames, rows, errors, report)
    if not rows:
        raise RuntimeError("没有生成有效记录，详见errors.jsonl")
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="公开列表页批量提取为CSV")
    parser.add_argument("--config", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    report = collect(args.config, args.output)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
