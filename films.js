export function initializeFilms(projects) {
  const films = Object.entries(projects).filter(([, project]) => project.video)
    .sort((a, b) => Number(Boolean(b[1].flagship)) - Number(Boolean(a[1].flagship)));
  const leadId = films.find(([, project]) => project.flagship)?.[0] || 'taohuayuan';
  const lead = document.querySelector('#film-feature');
  const grid = document.querySelector('#film-grid');
  if (!lead || !grid) return;

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  for (const [index, [id, project]] of films.entries()) {
    const narrative = id === 'taohuayuan' || project.filmType === 'narrative';
    const featured = id === leadId;
    const card = element('button', featured ? 'film-card film-feature' : 'film-card');
    if (project.flagship) card.classList.add('film-flagship');
    card.type = 'button';
    card.dataset.project = id;
    card.dataset.playVideo = 'true';
    card.setAttribute('aria-label', `播放${project.title}`);
    const picture = element('span', 'film-picture');
    const image = element('img');
    image.src = project.image.startsWith('assets/') ? project.image : `assets/${project.image}`;
    image.alt = '';
    image.loading = 'lazy';
    image.decoding = 'async';
    image.width = project.frameWidth || 1024;
    image.height = project.frameHeight || 576;
    const play = element('span', 'film-play-icon', '▶');
    play.setAttribute('aria-hidden', 'true');
    picture.append(image, play, element('span', 'film-duration', project.duration || '03:01'));
    const copy = element('span', 'film-copy');
    copy.append(element('span', 'film-kicker', `${String(index + 1).padStart(2, '0')} / ${project.flagship ? 'FEATURED ORIGINAL FILM' : narrative ? 'NARRATIVE FILM' : 'PRODUCT FILM'}`));
    copy.append(element('h3', '', project.title));
    copy.append(element('span', 'film-description', project.filmDescription || (id === 'taohuayuan' ? '沿着一条溪流，走进文字里的桃花源。\n国风动画 · 完整叙事 · 3分01秒' : project.subtitle)));
    if (featured) copy.append(element('span', 'film-feature-action', '播放完整短片 ↗'));
    card.append(picture, copy);
    (featured ? lead : grid).append(card);
    if (featured && project.caseStudy) {
      const detail = element('a', 'film-case-link', '查看分镜与制作拆解 ↗');
      detail.href = project.caseStudy;
      lead.append(detail);
    }
  }
  document.querySelectorAll('[data-film-count]').forEach(node => { node.textContent = String(films.length).padStart(2, '0'); });
}
