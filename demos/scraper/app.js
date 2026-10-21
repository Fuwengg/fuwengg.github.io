'use strict';
const element = id => document.getElementById(id);
let records = [];

function sourceLink(value) {
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && url.hostname === 'books.toscrape.com') return url.href;
  } catch (_) {}
  return null;
}

function render() {
  const query = element('search').value.trim().toLocaleLowerCase();
  const visible = records.filter(row => ['商品名称', '价格', '库存状态'].some(key => String(row[key] || '').toLocaleLowerCase().includes(query)));
  const fragment = document.createDocumentFragment();
  visible.forEach(row => {
    const tr = document.createElement('tr');
    [String(records.indexOf(row) + 1).padStart(2, '0'), row['商品名称'], row['价格'], row['库存状态']].forEach((value, index) => {
      const td = document.createElement('td');
      const content = index === 3 ? document.createElement('span') : td;
      if (index === 3) { content.className = 'stock'; td.append(content); }
      content.textContent = value || '—';
      tr.append(td);
    });
    const td = document.createElement('td');
    const href = sourceLink(row['商品链接']);
    if (href) {
      const a = document.createElement('a');
      a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.className = 'source-link'; a.textContent = '原始页面 ↗'; td.append(a);
    } else td.textContent = '—';
    tr.append(td); fragment.append(tr);
  });
  element('rows').replaceChildren(fragment);
  element('empty').hidden = visible.length > 0;
  element('resultCount').textContent = `显示 ${visible.length} / ${records.length} 条历史记录`;
}

async function load() {
  try {
    const values = await Promise.all(['records.json', 'run_report.json'].map(async file => {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`样本文件读取失败：${file}`);
      return response.json();
    }));
    if (!Array.isArray(values[0])) throw new Error('样本记录格式无效。');
    records = values[0];
    const report = values[1];
    element('recordCount').textContent = records.length;
    element('pageCount').textContent = report.pages_fetched;
    element('errorCount').textContent = report.errors;
    const date = String(report.started_at_utc || '').slice(0, 10);
    element('sampleDate').textContent = date || '未记录';
    element('sampleDate').dateTime = date;
    render();
  } catch (error) {
    element('error').textContent = error.message;
    element('error').hidden = false;
    element('resultCount').textContent = '未能载入样本，请刷新重试。';
  }
}
element('search').addEventListener('input', render);
load();
