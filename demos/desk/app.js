const STORAGE_KEY = 'le_portfolio_demo_desk_v2';

const defaultState = () => ({
  version: 2,
  tasks: [],
  conversations: [],
  approvals: [],
  activity: [],
  settings: {
    triage: true,
    draftReplies: true,
    taskSuggestions: false
  }
});

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const app = $('#app');
const modalBackdrop = $('#modalBackdrop');
const modalForm = $('#modalForm');
const modalBody = $('#modalBody');
const toast = $('#toast');
const commandMenu = $('#commandMenu');
const commandInput = $('#commandInput');

let state = loadState();
let activeView = 'overview';
let activeThreadId = null;
let activeApprovalId = null;
let taskFilter = 'all';
let modalMode = null;
let toastTimer = null;

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (parsed?.version === 2) return parsed;
  } catch (error) {
    console.warn('Unable to read local workspace state', error);
  }
  return defaultState();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function id(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function nowISO() {
  return new Date().toISOString();
}

function timeLabel(value) {
  return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
}

function dateTimeLabel(value) {
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
}

function dateLabel(value) {
  if (!value) return '未设置';
  return new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
}

function initialOf(name = '') {
  return [...name.trim()][0]?.toUpperCase() || '客';
}

function activity(actor, action, detail) {
  state.activity.unshift({ id: id('log'), actor, action, detail, at: nowISO() });
  state.activity = state.activity.slice(0, 200);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function switchView(view) {
  const target = $(`#${view}View`);
  if (!target) return;
  activeView = view;
  $$('.view').forEach(item => item.classList.toggle('is-active', item === target));
  $$('.nav-item[data-view]').forEach(item => item.classList.toggle('is-active', item.dataset.view === view));
  $('#viewLabel').textContent = target.dataset.title || '';
  app.classList.remove('nav-open');
  renderAll();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function emptyState(icon, title, text, action = '') {
  return `<div class="empty-state">
    <span class="empty-icon">${icon}</span>
    <strong>${escapeHTML(title)}</strong>
    <p>${escapeHTML(text)}</p>
    ${action ? `<button class="secondary-button small" type="button" data-action="${action}">${action === 'new-task' ? '新建任务' : '录入客户消息'}</button>` : ''}
  </div>`;
}

const taskIcon = '<svg viewBox="0 0 24 24"><path d="M9 5h11M9 12h11M9 19h11M4 5.2l1.2 1.2L7.5 4M4 12.2l1.2 1.2 2.3-2.4M4 19.2l1.2 1.2 2.3-2.4"/></svg>';
const inboxIcon = '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H5.5L4 18.2V4Z"/><path d="M8 9h8M8 12h5"/></svg>';
const shieldIcon = '<svg viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>';

function renderAll() {
  renderMetrics();
  renderOverview();
  renderInbox();
  renderTasks();
  renderClients();
  renderApprovals();
  renderActivity();
  renderSettings();
}

function renderMetrics() {
  const pendingThreads = state.conversations.filter(item => item.status === 'draft').length;
  const activeTasks = state.tasks.filter(item => item.status !== 'done').length;
  const pendingApprovals = state.approvals.filter(item => item.status === 'pending').length;

  $('#metricInbox').textContent = pendingThreads;
  $('#metricTasks').textContent = activeTasks;
  $('#metricApprovals').textContent = pendingApprovals;
  $('#metricClients').textContent = state.conversations.length;
  $('#metricInboxNote').textContent = pendingThreads ? `${pendingThreads} 条草稿等待确认` : '当前没有新消息';
  $('#metricTasksNote').textContent = activeTasks ? `${state.tasks.filter(item => item.status === 'doing').length} 个正在处理` : '尚未创建任务';
  $('#metricApprovalsNote').textContent = pendingApprovals ? '签署或敏感操作待本人决定' : '没有待确认事项';
  $('#metricClientsNote').textContent = state.conversations.length ? '来自实际录入的咨询' : '收到咨询后自动建立';

  setNavCount($('#inboxNavCount'), pendingThreads);
  setNavCount($('#taskNavCount'), activeTasks);
  setNavCount($('#approvalNavCount'), pendingApprovals);
  $('#setupPanel').hidden = Boolean(state.tasks.length || state.conversations.length || state.approvals.length);
}

function setNavCount(element, count) {
  element.textContent = count;
  element.hidden = count === 0;
}

function renderOverview() {
  const openTasks = state.tasks.filter(item => item.status !== 'done').slice(0, 4);
  $('#overviewTaskList').innerHTML = openTasks.length ? openTasks.map(task => `
    <div class="overview-task">
      <button type="button" data-task-toggle="${task.id}" aria-label="完成任务"></button>
      <div><strong>${escapeHTML(task.title)}</strong><small>${statusText(task.status)} · ${dateLabel(task.due)}</small></div>
      <span class="pill ${task.priority}">${priorityText(task.priority)}</span>
    </div>`).join('') : emptyState(taskIcon, '当前没有任务', '创建任务后，进度和截止日会显示在这里。', 'new-task');

  const approvals = state.approvals.filter(item => item.status === 'pending').slice(0, 3);
  $('#overviewApprovalList').innerHTML = approvals.length ? approvals.map(item => `
    <button class="approval-item" type="button" data-approval-open="${item.id}">
      <span class="approval-type-icon">${approvalTypeIcon(item.type)}</span>
      <span><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.source)}</p><small>等待 Le · ${dateTimeLabel(item.createdAt)}</small></span>
    </button>`).join('') : emptyState(shieldIcon, '不需要你处理', '签署、付款或身份验证出现时，会明确进入这里。');
}

function renderInbox() {
  const query = ($('#threadSearch')?.value || '').trim().toLowerCase();
  const items = state.conversations.filter(item => `${item.name} ${item.company} ${item.messages.map(m => m.text).join(' ')}`.toLowerCase().includes(query));
  if (!activeThreadId || !state.conversations.some(item => item.id === activeThreadId)) activeThreadId = state.conversations[0]?.id || null;

  $('#threadList').innerHTML = items.length ? items.map(item => {
    const last = item.messages[item.messages.length - 1];
    return `<button class="thread-item ${item.id === activeThreadId ? 'is-active' : ''}" type="button" data-thread="${item.id}">
      <span class="thread-avatar">${escapeHTML(initialOf(item.name))}</span>
      <span class="thread-copy"><strong>${escapeHTML(item.name)}</strong><p>${escapeHTML(last?.text || '')}</p><span class="thread-status ${item.status === 'sent' ? 'sent' : ''}">${item.status === 'sent' ? '已回复' : '草稿待确认'}</span></span>
      <time>${timeLabel(item.updatedAt)}</time>
    </button>`;
  }).join('') : emptyState(inboxIcon, query ? '没有匹配结果' : '收件箱为空', query ? '换一个关键词再试。' : '录入客户发来的消息后，系统会建立会话并准备回复草稿。', query ? '' : 'receive-message');

  const thread = state.conversations.find(item => item.id === activeThreadId);
  if (!thread) {
    $('#conversationPane').innerHTML = emptyState(inboxIcon, '选择一条客户消息', '这里会显示对话、回复草稿和人工确认动作。', 'receive-message');
    return;
  }

  $('#conversationPane').innerHTML = `
    <header class="conversation-head"><div><strong>${escapeHTML(thread.name)}${thread.company ? ` · ${escapeHTML(thread.company)}` : ''}</strong><span>${escapeHTML(thread.category)} · 建立于 ${dateTimeLabel(thread.createdAt)}</span></div><b>${thread.status === 'sent' ? '已回复' : '待 Le 确认'}</b></header>
    <div class="messages">${thread.messages.map(message => `
      <div class="message ${message.role === 'le' ? 'is-own' : ''}"><div class="meta"><span>${message.role === 'le' ? 'Le' : escapeHTML(thread.name)}</span><time>${timeLabel(message.at)}</time></div><div class="bubble">${escapeHTML(message.text)}</div></div>`).join('')}</div>
    ${thread.status === 'draft' ? `
      <div class="draft-panel"><div class="draft-head"><strong>回复草稿</strong><span>尚未发送</span></div>
        <textarea id="draftEditor" aria-label="回复草稿">${escapeHTML(thread.draft || '')}</textarea>
        <div class="draft-actions"><p>系统不会在后台自动发出任何消息。</p><div><button class="secondary-button" type="button" data-escalate-thread="${thread.id}">转交给 Le</button><button class="primary-button" type="button" data-send-draft="${thread.id}">确认并标记发送</button></div></div>
      </div>` : `
      <div class="draft-panel"><div class="draft-actions"><p>最近一次回复已由 Le 确认。</p><div><button class="secondary-button" type="button" data-reopen-thread="${thread.id}">重新生成草稿</button></div></div></div>`}
  `;
  const messages = $('.messages');
  if (messages) messages.scrollTop = messages.scrollHeight;
}

function renderTasks() {
  const filtered = taskFilter === 'all' ? state.tasks : state.tasks.filter(item => item.status === taskFilter);
  $('#taskTableCount').textContent = `${filtered.length} 个任务`;
  if (!filtered.length) {
    $('#taskTable').innerHTML = emptyState(taskIcon, state.tasks.length ? '该分类没有任务' : '尚未创建任务', state.tasks.length ? '选择其他状态查看任务。' : '创建任务并设置优先级、截止日期和执行状态。', state.tasks.length ? '' : 'new-task');
    return;
  }
  $('#taskTable').innerHTML = `<table class="data-table"><thead><tr><th>任务</th><th>状态</th><th>优先级</th><th>截止日</th><th>负责人</th><th>操作</th></tr></thead><tbody>${filtered.map(task => `
    <tr>
      <td><div class="task-title ${task.status === 'done' ? 'is-done' : ''}"><button class="${task.status === 'done' ? 'is-done' : ''}" type="button" data-task-toggle="${task.id}" aria-label="切换完成状态">${task.status === 'done' ? '✓' : ''}</button><div><strong>${escapeHTML(task.title)}</strong><small>${escapeHTML(task.description || '无补充说明')}</small></div></div></td>
      <td><span class="pill ${task.status}">${statusText(task.status)}</span></td>
      <td><span class="pill ${task.priority}">${priorityText(task.priority)}</span></td>
      <td>${dateLabel(task.due)}</td><td>${escapeHTML(task.owner)}</td>
      <td><div class="row-actions">${task.status !== 'done' ? `<button type="button" data-task-status="${task.id}" data-status="${task.status === 'doing' ? 'todo' : 'doing'}">${task.status === 'doing' ? '暂停' : '开始'}</button>` : ''}<button type="button" data-task-edit="${task.id}">编辑</button></div></td>
    </tr>`).join('')}</tbody></table>`;
}

function renderClients() {
  if (!state.conversations.length) {
    $('#clientTable').innerHTML = emptyState(inboxIcon, '还没有客户记录', '客户记录由实际录入的消息产生，不会自动填充示例数据。', 'receive-message');
    return;
  }
  $('#clientTable').innerHTML = `<table class="data-table"><thead><tr><th>客户</th><th>类型</th><th>最近联系</th><th>会话状态</th><th>敏感事项</th><th>操作</th></tr></thead><tbody>${state.conversations.map(item => {
    const pending = state.approvals.filter(a => a.threadId === item.id && a.status === 'pending').length;
    return `<tr><td><div class="client-cell"><span class="thread-avatar">${escapeHTML(initialOf(item.name))}</span><div><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.company || '未填写公司')}</small></div></div></td><td>${escapeHTML(item.category)}</td><td>${dateTimeLabel(item.updatedAt)}</td><td><span class="pill ${item.status === 'sent' ? 'done' : 'medium'}">${item.status === 'sent' ? '已回复' : '待确认'}</span></td><td>${pending ? `<span class="pill high">${pending} 项待处理</span>` : '—'}</td><td><div class="row-actions"><button type="button" data-client-open="${item.id}">打开会话</button></div></td></tr>`;
  }).join('')}</tbody></table>`;
}

function renderApprovals() {
  const pending = state.approvals.filter(item => item.status === 'pending');
  $('#approvalListNote').textContent = `${pending.length} 项`;
  if (!activeApprovalId || !state.approvals.some(item => item.id === activeApprovalId && item.status === 'pending')) activeApprovalId = pending[0]?.id || null;

  $('#approvalList').innerHTML = pending.length ? pending.map(item => `
    <button class="approval-item ${item.id === activeApprovalId ? 'is-active' : ''}" type="button" data-approval-select="${item.id}">
      <span class="approval-type-icon">${approvalTypeIcon(item.type)}</span>
      <span><strong>${escapeHTML(item.title)}</strong><p>${escapeHTML(item.source)}</p><small>等待本人 · ${dateTimeLabel(item.createdAt)}</small></span>
    </button>`).join('') : emptyState(shieldIcon, '没有待处理事项', '涉及签署、付款、身份验证或主动转交的内容会出现在这里。');

  const item = state.approvals.find(entry => entry.id === activeApprovalId && entry.status === 'pending');
  if (!item) {
    $('#approvalDetail').innerHTML = emptyState(shieldIcon, '请选择一项', '选中左侧事项后，可查看来源、原因和处理动作。');
    return;
  }
  $('#approvalDetail').innerHTML = `<div class="approval-detail-inner">
    <span class="approval-detail-badge">必须由 LE 处理</span><h2>${escapeHTML(item.title)}</h2><span class="detail-subtitle">${escapeHTML(item.source)} · ${dateTimeLabel(item.createdAt)}</span>
    <div class="detail-block"><span>事项内容</span><p>${escapeHTML(item.detail)}</p></div>
    <div class="detail-block"><span>权限判定</span><div class="detail-grid"><div class="detail-field"><span>风险类型</span><strong>${approvalTypeText(item.type)}</strong></div><div class="detail-field"><span>当前状态</span><strong>已推送给 Le，等待本人</strong></div><div class="detail-field"><span>助手权限</span><strong>只读 / 整理材料</strong></div><div class="detail-field"><span>外部动作</span><strong>尚未执行</strong></div></div></div>
    <div class="detail-block"><span>处理说明</span><p>“标记已处理”只更新此工作台的跟踪状态，不代表外部合同、付款或验证已经自动完成。</p></div>
    <div class="approval-actions"><button class="secondary-button" type="button" data-approval-reject="${item.id}">暂不处理</button><button class="primary-button" type="button" data-approval-complete="${item.id}">由 Le 标记已处理</button></div>
  </div>`;
}

function renderActivity() {
  $('#activityCount').textContent = `${state.activity.length} 条`;
  $('#activityList').innerHTML = state.activity.length ? state.activity.map(item => `
    <div class="activity-row"><span class="activity-icon ${item.actor}">${item.actor === 'user' ? 'LE' : 'AI'}</span><div class="activity-copy"><strong>${escapeHTML(item.action)}</strong><p>${escapeHTML(item.detail)}</p></div><time>${dateTimeLabel(item.at)}</time></div>`).join('') : emptyState('<svg viewBox="0 0 24 24"><path d="M12 8v5l3 2M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>', '还没有操作记录', '当你创建任务、录入消息或处理审批后，记录会从这里开始。');
}

function renderSettings() {
  $$('[data-setting]').forEach(input => { input.checked = Boolean(state.settings[input.dataset.setting]); });
}

function statusText(status) {
  return ({ todo: '待开始', doing: '进行中', done: '已完成' })[status] || status;
}

function priorityText(priority) {
  return ({ high: '高', medium: '中', low: '低' })[priority] || priority;
}

function approvalTypeIcon(type) {
  return ({ signature: '签', payment: '付', identity: '验', review: '审' })[type] || '审';
}

function approvalTypeText(type) {
  return ({ signature: '合同 / 签署', payment: '付款 / 财务', identity: '身份验证', review: '人工判断' })[type] || '人工判断';
}

function detectSensitive(text) {
  const rules = [
    { type: 'signature', words: ['合同', '协议', '签字', '签署', '盖章'] },
    { type: 'payment', words: ['付款', '打款', '转账', '收款', '支付', '发票'] },
    { type: 'identity', words: ['验证', '验证码', '身份证', '实名', '人脸'] }
  ];
  return rules.find(rule => rule.words.some(word => text.includes(word))) || null;
}

function categorize(text) {
  if (/售后|问题|故障|退款/.test(text)) return '客户支持';
  if (/合作|项目|方案|报价|预算/.test(text)) return '商务咨询';
  if (/合同|签署|付款|验证/.test(text)) return '敏感事项';
  return '一般咨询';
}

function makeDraft(name, text, sensitive) {
  if (sensitive) return `${name}你好，消息已经收到。这个事项需要 Le 本人确认，我已整理内容并加入他的待处理列表。确认后会由本人继续跟进。`;
  if (/报价|预算|价格/.test(text)) return `${name}你好，信息已收到。我先整理你的需求和预算范围，再由 Le 确认合作范围后回复你。方便的话，也请补充期望的交付时间。`;
  if (/时间|预约|会议|沟通/.test(text)) return `${name}你好，收到。我已经记录你的时间需求，待 Le 确认日程后会回复具体安排。`;
  return `${name}你好，消息已经收到。我已整理主要信息并加入 Le 的工作队列，确认后会尽快回复你。`;
}

function openModal(mode, payload = null) {
  modalMode = mode;
  modalForm.dataset.payload = payload || '';
  if (mode === 'task') renderTaskModal(payload);
  if (mode === 'message') renderMessageModal();
  if (mode === 'quick') renderQuickModal();
  if (mode === 'reset') renderResetModal();
  if (mode === 'connect') renderConnectModal(payload);
  modalBackdrop.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('input, textarea, select', modalBody)?.focus(), 30);
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.style.overflow = '';
  modalMode = null;
  modalForm.dataset.payload = '';
}

function setModal(eyebrow, title, submitLabel, html, hideSubmit = false) {
  $('#modalEyebrow').textContent = eyebrow;
  $('#modalTitle').textContent = title;
  $('#modalSubmitButton').textContent = submitLabel;
  $('#modalSubmitButton').hidden = hideSubmit;
  modalBody.innerHTML = html;
}

function renderTaskModal(taskId) {
  const task = state.tasks.find(item => item.id === taskId);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  setModal('WORK QUEUE', task ? '编辑任务' : '新建任务', task ? '保存更改' : '创建任务', `<div class="form-grid">
    <div class="form-field full"><label for="taskTitle">任务名称</label><input id="taskTitle" name="title" required maxlength="80" value="${escapeHTML(task?.title || '')}" placeholder="例如：整理本周客户需求" /></div>
    <div class="form-field full"><label for="taskDescription">补充说明</label><textarea id="taskDescription" name="description" maxlength="300" placeholder="写清交付结果或下一步…">${escapeHTML(task?.description || '')}</textarea></div>
    <div class="form-field"><label for="taskPriority">优先级</label><select id="taskPriority" name="priority"><option value="high" ${task?.priority === 'high' ? 'selected' : ''}>高</option><option value="medium" ${!task || task.priority === 'medium' ? 'selected' : ''}>中</option><option value="low" ${task?.priority === 'low' ? 'selected' : ''}>低</option></select></div>
    <div class="form-field"><label for="taskDue">截止日期</label><input id="taskDue" name="due" type="date" value="${escapeHTML(task?.due || tomorrow)}" /></div>
    <div class="form-field"><label for="taskOwner">负责人</label><select id="taskOwner" name="owner"><option value="Le Assistant" ${task?.owner !== 'Le' ? 'selected' : ''}>Le Assistant</option><option value="Le" ${task?.owner === 'Le' ? 'selected' : ''}>Le</option></select></div>
    <div class="form-field"><label for="taskStatus">状态</label><select id="taskStatus" name="status"><option value="todo" ${!task || task.status === 'todo' ? 'selected' : ''}>待开始</option><option value="doing" ${task?.status === 'doing' ? 'selected' : ''}>进行中</option><option value="done" ${task?.status === 'done' ? 'selected' : ''}>已完成</option></select></div>
  </div>`);
}

function renderMessageModal() {
  setModal('CUSTOMER INBOX', '录入客户消息', '建立会话', `<div class="form-grid">
    <div class="form-field"><label for="customerName">客户称呼</label><input id="customerName" name="name" required maxlength="30" placeholder="例如：王女士" /></div>
    <div class="form-field"><label for="customerCompany">公司 / 项目</label><input id="customerCompany" name="company" maxlength="50" placeholder="选填" /></div>
    <div class="form-field full"><label for="customerMessage">收到的原始消息</label><textarea id="customerMessage" name="message" required maxlength="1000" placeholder="粘贴或输入客户实际发来的内容…"></textarea><small>若内容涉及合同、签署、付款或身份验证，将自动进入“需要 Le 处理”。</small></div>
    <div class="form-field full"><div class="form-note">建立会话后只会生成回复草稿。草稿必须由 Le 点击确认，页面才会把它标记为已发送。</div></div>
  </div>`);
}

function renderQuickModal() {
  setModal('QUICK ADD', '新建', '', `<div class="setup-actions">
    <button type="button" data-modal-next="message"><span>01</span><strong>录入客户消息</strong><small>建立会话并生成草稿</small></button>
    <button type="button" data-modal-next="task"><span>02</span><strong>新建任务</strong><small>加入工作队列</small></button>
    <button type="button" data-modal-next="approval"><span>03</span><strong>查看人工审批</strong><small>处理签署与敏感事项</small></button>
  </div>`, true);
}

function renderResetModal() {
  setModal('LOCAL DATA', '清空本地工作区', '确认清空', `<div class="form-grid"><div class="form-field full"><div class="form-note">这会删除本页面在当前浏览器中保存的客户、任务、审批和操作记录。页面文件本身不会被删除。</div></div><div class="form-field full"><label for="resetConfirm">输入“清空”以确认</label><input id="resetConfirm" name="confirm" required autocomplete="off" placeholder="清空" /></div></div>`);
}

function renderConnectModal(name) {
  setModal('CONNECTION', `配置${name}`, '知道了', `<div class="form-grid"><div class="form-field full"><div class="form-note">当前页面是本机工作区，还没有邮件或日历服务端连接。正式接入需要对应服务的授权凭据和后端回调地址；在配置完成前，状态会保持“未连接”。</div></div><div class="form-field full"><label>当前状态</label><input value="未连接 · 不会收发外部数据" disabled /></div></div>`);
}

function submitModal(event) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(modalForm).entries());
  if (modalMode === 'task') saveTask(data, modalForm.dataset.payload);
  if (modalMode === 'message') saveMessage(data);
  if (modalMode === 'reset') resetWorkspace(data);
  if (modalMode === 'connect') closeModal();
}

function saveTask(data, taskId) {
  const existing = state.tasks.find(item => item.id === taskId);
  if (existing) {
    Object.assign(existing, { title: data.title.trim(), description: data.description.trim(), priority: data.priority, due: data.due, owner: data.owner, status: data.status, updatedAt: nowISO() });
    activity('user', '更新任务', `${existing.title} · ${statusText(existing.status)}`);
    showToast('任务已更新');
  } else {
    const task = { id: id('task'), title: data.title.trim(), description: data.description.trim(), priority: data.priority, due: data.due, owner: data.owner, status: data.status, createdAt: nowISO(), updatedAt: nowISO() };
    state.tasks.unshift(task);
    activity('user', '创建任务', `${task.title} · 负责人 ${task.owner}`);
    showToast('任务已加入工作队列');
  }
  saveState(); closeModal(); renderAll();
}

function saveMessage(data) {
  const message = data.message.trim();
  const sensitive = detectSensitive(message);
  const thread = {
    id: id('thread'), name: data.name.trim(), company: data.company.trim(), category: categorize(message), status: 'draft',
    draft: state.settings.draftReplies ? makeDraft(data.name.trim(), message, sensitive) : '',
    messages: [{ role: 'client', text: message, at: nowISO() }], createdAt: nowISO(), updatedAt: nowISO()
  };
  state.conversations.unshift(thread);
  activeThreadId = thread.id;
  activity('user', '录入客户消息', `${thread.name}${thread.company ? ` · ${thread.company}` : ''}`);
  if (state.settings.triage) activity('assistant', '完成消息分类', `${thread.name} · ${thread.category}`);
  if (state.settings.draftReplies) activity('assistant', '生成回复草稿', `${thread.name} · 等待 Le 确认发送`);
  if (sensitive) {
    const approval = { id: id('approval'), threadId: thread.id, type: sensitive.type, title: `${approvalTypeText(sensitive.type)}需要本人处理`, source: `${thread.name}${thread.company ? ` · ${thread.company}` : ''}`, detail: message, status: 'pending', createdAt: nowISO(), updatedAt: nowISO() };
    state.approvals.unshift(approval);
    activeApprovalId = approval.id;
    activity('assistant', '已推送给 Le', `${approval.title} · 外部动作尚未执行`);
  }
  saveState(); closeModal(); switchView('inbox');
  showToast(sensitive ? '已建立会话；敏感事项已推送给 Le' : '已建立会话并生成回复草稿');
}

function resetWorkspace(data) {
  if (data.confirm.trim() !== '清空') {
    showToast('请输入“清空”后再确认');
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  activeThreadId = null;
  activeApprovalId = null;
  saveState(); closeModal(); switchView('overview');
  showToast('本地工作区已清空');
}

function toggleTask(taskId) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return;
  task.status = task.status === 'done' ? 'todo' : 'done';
  task.updatedAt = nowISO();
  activity('user', task.status === 'done' ? '完成任务' : '重新打开任务', task.title);
  saveState(); renderAll();
  showToast(task.status === 'done' ? '任务已完成' : '任务已重新打开');
}

function setTaskStatus(taskId, status) {
  const task = state.tasks.find(item => item.id === taskId);
  if (!task) return;
  task.status = status; task.updatedAt = nowISO();
  activity('user', status === 'doing' ? '开始任务' : '暂停任务', task.title);
  saveState(); renderAll(); showToast(`任务已设为${statusText(status)}`);
}

function sendDraft(threadId) {
  const thread = state.conversations.find(item => item.id === threadId);
  const editor = $('#draftEditor');
  if (!thread || !editor) return;
  const text = editor.value.trim();
  if (!text) { showToast('回复内容不能为空'); return; }
  thread.draft = text;
  thread.messages.push({ role: 'le', text, at: nowISO() });
  thread.status = 'sent'; thread.updatedAt = nowISO();
  activity('user', '确认对外回复', `${thread.name} · 已在工作台标记发送`);
  saveState(); renderAll(); showToast('回复已由 Le 确认并标记发送');
}

function reopenThread(threadId) {
  const thread = state.conversations.find(item => item.id === threadId);
  if (!thread) return;
  thread.status = 'draft';
  thread.draft = `你好${thread.name}，关于刚才的信息，我再补充说明：`;
  thread.updatedAt = nowISO();
  activity('user', '重新打开会话', `${thread.name} · 新草稿等待确认`);
  saveState(); renderAll();
}

function escalateThread(threadId) {
  const thread = state.conversations.find(item => item.id === threadId);
  if (!thread) return;
  const existing = state.approvals.find(item => item.threadId === threadId && item.status === 'pending');
  if (existing) { activeApprovalId = existing.id; switchView('approvals'); showToast('这条会话已经在 Le 的待处理列表中'); return; }
  const approval = { id: id('approval'), threadId, type: 'review', title: '客户回复需要本人判断', source: `${thread.name}${thread.company ? ` · ${thread.company}` : ''}`, detail: thread.messages.at(-1)?.text || '', status: 'pending', createdAt: nowISO(), updatedAt: nowISO() };
  state.approvals.unshift(approval); activeApprovalId = approval.id;
  activity('assistant', '已推送给 Le', `${thread.name}的客户回复需要本人判断`);
  saveState(); switchView('approvals'); showToast('已推送给 Le');
}

function updateApproval(approvalId, status) {
  const item = state.approvals.find(entry => entry.id === approvalId);
  if (!item) return;
  item.status = status; item.updatedAt = nowISO();
  activity('user', status === 'completed' ? '本人标记已处理' : '本人暂不处理', `${item.title} · ${item.source}`);
  activeApprovalId = null;
  saveState(); renderAll();
  showToast(status === 'completed' ? '已更新跟踪状态，未代替外部签署或付款' : '事项已移出待处理列表');
}

function exportActivity() {
  if (!state.activity.length) { showToast('当前没有可导出的操作记录'); return; }
  const lines = ['Le Desk 操作记录', `导出时间：${new Date().toLocaleString('zh-CN')}`, '', ...state.activity.map(item => `${new Date(item.at).toLocaleString('zh-CN')} | ${item.actor === 'user' ? 'Le' : 'Le Assistant'} | ${item.action} | ${item.detail}`)];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = `le-desk-activity-${new Date().toISOString().slice(0,10)}.txt`; anchor.click();
  URL.revokeObjectURL(url);
  activity('user', '导出操作记录', `${state.activity.length} 条记录`);
  saveState(); renderAll(); showToast('操作记录已导出');
}

const commands = [
  { key: 'overview', icon: '概', title: '工作概览', note: '查看当前队列与统计', run: () => switchView('overview') },
  { key: 'inbox', icon: '信', title: '客户收件箱', note: '查看客户消息与回复草稿', run: () => switchView('inbox') },
  { key: 'tasks', icon: '任', title: '任务', note: '查看和管理工作队列', run: () => switchView('tasks') },
  { key: 'approvals', icon: '审', title: '需要 Le 处理', note: '签署、付款和身份验证', run: () => switchView('approvals') },
  { key: 'new-task', icon: '＋', title: '新建任务', note: '创建工作项目', run: () => openModal('task') },
  { key: 'message', icon: '＋', title: '录入客户消息', note: '建立客户会话', run: () => openModal('message') }
];

function openCommandMenu() {
  commandMenu.hidden = false;
  commandInput.value = '';
  renderCommands();
  setTimeout(() => commandInput.focus(), 20);
}

function closeCommandMenu() {
  commandMenu.hidden = true;
}

function renderCommands() {
  const query = commandInput.value.trim().toLowerCase();
  const dynamic = [
    ...state.tasks.map(item => ({ key: `task-${item.id}`, icon: '任', title: item.title, note: `任务 · ${statusText(item.status)}`, run: () => { switchView('tasks'); } })),
    ...state.conversations.map(item => ({ key: `thread-${item.id}`, icon: initialOf(item.name), title: item.name, note: `客户 · ${item.company || item.category}`, run: () => { activeThreadId = item.id; switchView('inbox'); } }))
  ];
  const results = [...commands, ...dynamic].filter(item => `${item.title} ${item.note}`.toLowerCase().includes(query)).slice(0, 10);
  $('#commandResults').innerHTML = results.length ? results.map(item => `<button class="command-result" type="button" data-command="${item.key}"><span>${escapeHTML(item.icon)}</span><div><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.note)}</small></div></button>`).join('') : '<div class="empty-state compact"><strong>没有匹配结果</strong><p>试试搜索“任务”“客户”或具体名称。</p></div>';
  $('#commandResults')._items = [...commands, ...dynamic];
}

document.addEventListener('click', event => {
  const nav = event.target.closest('[data-view]');
  if (nav) { switchView(nav.dataset.view); return; }
  const viewButton = event.target.closest('[data-open-view]');
  if (viewButton) { switchView(viewButton.dataset.openView); return; }
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (action === 'new-task') { openModal('task'); return; }
  if (action === 'receive-message') { openModal('message'); return; }
  const threadButton = event.target.closest('[data-thread]');
  if (threadButton) { activeThreadId = threadButton.dataset.thread; renderInbox(); return; }
  const clientButton = event.target.closest('[data-client-open]');
  if (clientButton) { activeThreadId = clientButton.dataset.clientOpen; switchView('inbox'); return; }
  const taskToggle = event.target.closest('[data-task-toggle]');
  if (taskToggle) { toggleTask(taskToggle.dataset.taskToggle); return; }
  const taskStatusButton = event.target.closest('[data-task-status]');
  if (taskStatusButton) { setTaskStatus(taskStatusButton.dataset.taskStatus, taskStatusButton.dataset.status); return; }
  const taskEdit = event.target.closest('[data-task-edit]');
  if (taskEdit) { openModal('task', taskEdit.dataset.taskEdit); return; }
  const sendButton = event.target.closest('[data-send-draft]');
  if (sendButton) { sendDraft(sendButton.dataset.sendDraft); return; }
  const reopenButton = event.target.closest('[data-reopen-thread]');
  if (reopenButton) { reopenThread(reopenButton.dataset.reopenThread); return; }
  const escalateButton = event.target.closest('[data-escalate-thread]');
  if (escalateButton) { escalateThread(escalateButton.dataset.escalateThread); return; }
  const approvalOpen = event.target.closest('[data-approval-open]');
  if (approvalOpen) { activeApprovalId = approvalOpen.dataset.approvalOpen; switchView('approvals'); return; }
  const approvalSelect = event.target.closest('[data-approval-select]');
  if (approvalSelect) { activeApprovalId = approvalSelect.dataset.approvalSelect; renderApprovals(); return; }
  const approvalComplete = event.target.closest('[data-approval-complete]');
  if (approvalComplete) { updateApproval(approvalComplete.dataset.approvalComplete, 'completed'); return; }
  const approvalReject = event.target.closest('[data-approval-reject]');
  if (approvalReject) { updateApproval(approvalReject.dataset.approvalReject, 'dismissed'); return; }
  const next = event.target.closest('[data-modal-next]')?.dataset.modalNext;
  if (next === 'task' || next === 'message') { closeModal(); openModal(next); return; }
  if (next === 'approval') { closeModal(); switchView('approvals'); return; }
  const connect = event.target.closest('[data-connect]');
  if (connect) { openModal('connect', connect.dataset.connect); return; }
  if (event.target.closest('[data-open-local]')) { showToast('数据保存在当前浏览器的 localStorage 中'); return; }
  const command = event.target.closest('[data-command]');
  if (command) {
    const item = $('#commandResults')._items.find(entry => entry.key === command.dataset.command);
    closeCommandMenu(); item?.run(); return;
  }
  if (!modalBackdrop.hidden && event.target === modalBackdrop) closeModal();
  if (!commandMenu.hidden && event.target === commandMenu) closeCommandMenu();
});

$('#quickAddButton').addEventListener('click', () => openModal('quick'));
$('#globalSearchButton').addEventListener('click', openCommandMenu);
$('#mobileMenuButton').addEventListener('click', () => app.classList.toggle('nav-open'));
$('#ownerMenuButton').addEventListener('click', () => showToast('当前账户：Le · 私人本地工作区'));
$('#modalCloseButton').addEventListener('click', closeModal);
$('#modalCancelButton').addEventListener('click', closeModal);
modalForm.addEventListener('submit', submitModal);
$('#resetWorkspaceButton').addEventListener('click', () => openModal('reset'));
$('#exportLogButton').addEventListener('click', exportActivity);
$('#threadSearch').addEventListener('input', renderInbox);
commandInput.addEventListener('input', renderCommands);

$('#taskFilters').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  taskFilter = button.dataset.filter;
  $$('#taskFilters button').forEach(item => item.classList.toggle('is-active', item === button));
  renderTasks();
});

$$('[data-setting]').forEach(input => input.addEventListener('change', () => {
  state.settings[input.dataset.setting] = input.checked;
  const labels = { triage: '客户消息分类', draftReplies: '生成回复草稿', taskSuggestions: '从消息创建任务' };
  activity('user', '更新自动化范围', `${labels[input.dataset.setting]} · ${input.checked ? '已启用' : '已停用'}`);
  saveState(); renderAll(); showToast('设置已保存');
}));

document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openCommandMenu(); }
  if (event.key === 'Escape') { if (!modalBackdrop.hidden) closeModal(); if (!commandMenu.hidden) closeCommandMenu(); app.classList.remove('nav-open'); }
});

$('#todayLabel').textContent = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(new Date());
renderAll();
