# 公开商品列表批量提取样品

定位：为无需登录、公开可访问、允许正常访问的同结构商品列表页，按冻结字段批量生成 CSV、失败清单和运行报告。

## 已实现

- 配置起始地址、列表卡片、分页按钮和字段选择器；
- 最多20页、5,000条的硬上限；
- 同源分页、跨域分页/重定向拒绝；
- `robots.txt`预检；
- 最低1秒请求间隔；
- 指定字段去重；
- UTF-8 BOM CSV、JSONL错误清单、JSON运行报告；
- 不保存账号、密码、Cookie或Token。

## 明确不支持

- 登录、验证码、付费墙或访问控制绕过；
- APP、私人账号、个人信息和非公开数据；
- 反爬规避；
- JavaScript渲染页面、任意网站万能适配；
- 未看目标网址和代表页面就承诺固定价格。

## 运行

```powershell
py -3 extractor.py --config config.books-demo.json --output demo-output
```

公开演示站仅用于能力测试。真实订单必须先审核目标网址、页面结构、字段、页数、数量、去重键和站点规则。

## Windows直接运行预览

- 隔离构建环境：项目根目录`.venv-pyinstaller`。
- 固定版本：PyInstaller 6.21.0、requests 2.33.0、beautifulsoup4 4.14.3；`pip check`通过。
- 预览目录：`delivery-preview/`；双击`运行工具.cmd`，不要求客户安装Python。
- 2026-08-22代表性烟测：预览EXE对公开演示站处理3页、60条、0错误，状态`complete`；输出CSV为60行。
- EXE SHA-256：`97A6EAE4CF7A0C0CE22587B56694B8F05ADAFC825B67C9EBDBE219C545BE2D20`。
- 许可：requests为Apache-2.0，beautifulsoup4为MIT，PyInstaller为GPLv2-or-later并含允许分发非自由程序的特别例外；仅做本地运行，不上传数据或读取凭据。

## 测试

```powershell
py -3 -m unittest -v test_extractor.py
```

当前验证：7/7自动测试通过；公开演示3页、60条、0错误。独立技术质检首轮FAIL后关闭4项阻断，回归结论为`PASS WITH BOUNDARIES`。报告：`reviews/PD013_TECHNICAL_QA_2026-07-26.md`。
