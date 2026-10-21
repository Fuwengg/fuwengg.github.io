const dialog = document.querySelector('#portrait-dialog');
const trigger = document.querySelector('#portrait-teaser');
const copy = document.querySelector('#portrait-copy-wechat');
const status = document.querySelector('#portrait-copy-status');

trigger.addEventListener('click', () => {
  status.textContent = '';
  dialog.showModal();
  document.body.classList.add('portrait-open');
});
dialog.querySelectorAll('.portrait-close, .portrait-back').forEach(button => {
  button.addEventListener('click', () => dialog.close());
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('portrait-open');
  trigger.focus({preventScroll: true});
});
copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('13147067501');
    status.textContent = '微信号已复制，去微信添加好友吧。';
  } catch {
    status.textContent = '请长按或选中上方微信号复制：13147067501';
  }
});

const form = document.querySelector('#portrait-unlock-form');
const codeInput = document.querySelector('#portrait-unlock-code');
const unlockStatus = document.querySelector('#portrait-unlock-status');
const submit = document.querySelector('#portrait-unlock-submit');
const actions = document.querySelector('#portrait-unlocked-actions');
const originalLink = document.querySelector('#portrait-original-link');
const portraitImages = [trigger.querySelector('img'), document.querySelector('#portrait-dialog-image')];
const mode = trigger.querySelector('.portrait-mode');
const cta = trigger.querySelector('.portrait-cta');
const characterLabel = document.querySelector('#portrait-character-label');
let originalUrl = null;
let unlocking = false;

function updatePortrait(url) {
  for (const image of portraitImages) {
    image.src = url || 'assets/community/atomgit-meetup.webp';
    image.alt = url ? 'Le 在 AtomGit AI 与昇腾 Meetup 活动现场的原图' : '金发超级赛亚人卡通贴纸遮脸照片';
  }
  dialog.classList.toggle('portrait-revealed', Boolean(url));
  trigger.classList.toggle('portrait-revealed', Boolean(url));
  mode.textContent = url ? '✦ ORIGINAL CHARACTER UNLOCKED' : '⚡ SUPER SAIYAN MODE';
  cta.textContent = url ? '帅哥本体已解锁 ↗' : '加微信打赏看帅哥 ↗';
  characterLabel.textContent = url ? '本体登场 · Le' : '隐藏款 · Le';
  document.querySelector('#portrait-dialog-title').innerHTML = url
    ? '本体已登场。<br><span>感谢你的支持。</span>'
    : '想看本体？<br><span>给帅气充个能。</span>';
  document.querySelector('#portrait-dialog-description').innerHTML = url
    ? '这就是贴纸下的我。<br>期待在微信里，认识同样有趣的你。'
    : '加微信，打赏不低于 5 元。<br>我确认到账后发你解锁码，回来揭晓本体。';
  trigger.setAttribute('aria-label', url ? '查看已解锁的现场原图' : '点击超级赛亚人贴纸，加微信打赏看帅哥');
  form.hidden = Boolean(url);
  actions.hidden = !url;
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (unlocking) return;
  const normalized = codeInput.value.toUpperCase().replace(/[\s-]/g, '');
  unlockStatus.dataset.error = 'true';
  if (!/^LE[A-HJ-NP-Z2-9]{24}$/.test(normalized)) {
    unlockStatus.textContent = '请粘贴微信收到的完整解锁码，以 LE 开头。';
    return;
  }
  if (!globalThis.crypto?.subtle) {
    unlockStatus.textContent = '请通过 HTTPS 网站或本机预览打开解锁页面。';
    return;
  }
  unlocking = true;
  submit.disabled = true;
  submit.textContent = '正在揭晓…';
  unlockStatus.textContent = '';
  try {
    const response = await fetch('assets/community/portrait-original.encrypted', {cache: 'no-store'});
    if (!response.ok) throw new Error('asset_unavailable');
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (new TextDecoder().decode(bytes.subarray(0,4)) !== 'LEP1') throw new Error('asset_unavailable');
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
    const key = await crypto.subtle.importKey('raw', digest, {name:'AES-GCM'}, false, ['decrypt']);
    let original;
    try {
      original = await crypto.subtle.decrypt({name:'AES-GCM', iv:bytes.subarray(4,16)}, key, bytes.subarray(16));
    } catch {
      throw new Error('invalid_code');
    }
    originalUrl = URL.createObjectURL(new Blob([original], {type:'image/webp'}));
    originalLink.href = originalUrl;
    updatePortrait(originalUrl);
    codeInput.value = '';
    originalLink.focus();
  } catch (error) {
    unlockStatus.textContent = error.message === 'invalid_code'
      ? '解锁码不正确，请核对微信中收到的完整内容。'
      : '原图暂时加载失败，请稍后重试；已收到的解锁码仍可使用。';
  } finally {
    unlocking = false;
    submit.disabled = false;
    submit.textContent = '解除变身 ↗';
  }
});

document.querySelector('#portrait-relock').addEventListener('click', () => {
  updatePortrait(null);
  if (originalUrl) URL.revokeObjectURL(originalUrl);
  originalUrl = null;
  originalLink.removeAttribute('href');
  unlockStatus.textContent = '';
  codeInput.focus();
});
