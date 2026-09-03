const fallbackContent = {
  profile: {
    name: 'Li Guoqiu', initials: 'LG', avatar: '',
    role: 'Senior Algorithm Engineer', company: 'Alibaba Group — Taobao Technology',
    bio: [
      'I am a Senior Algorithm Engineer at Alibaba Group’s Taobao Technology, working on applied artificial intelligence at scale.',
      'I received an M.S. in Artificial Intelligence from Tsinghua University and a B.Eng. in Electronic Information from Huazhong University of Science and Technology.'
    ],
    email: '', scholar_url: '', contact_note: 'Contact details coming soon'
  },
  news: [
    { date: '2025', text: 'Promoted to Senior Algorithm Engineer at Alibaba Group.' },
    { date: '2023', text: 'Joined Taobao Technology, Alibaba Group, as an Algorithm Engineer.' },
    { date: '2023', text: 'Graduated with an M.S. in Artificial Intelligence from Tsinghua University.' },
    { date: '2020', text: 'Graduated with a B.Eng. in Electronic Information from Huazhong University of Science and Technology.' }
  ],
  publications: [],
  projects: [],
  experience: [
    { period: '2025 — Present', title: 'Senior Algorithm Engineer', organization: 'Alibaba Group', detail: 'Taobao Technology', current: true },
    { period: '2023 — 2025', title: 'Algorithm Engineer', organization: 'Alibaba Group', detail: 'Taobao Technology', current: false },
    { period: '2020 — 2023', title: 'M.S. in Artificial Intelligence', organization: 'Tsinghua University', detail: '', current: false },
    { period: '2016 — 2020', title: 'B.Eng. in Electronic Information', organization: 'Huazhong University of Science and Technology', detail: '', current: false }
  ]
};

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function renderSite(content) {
  const profile = content.profile || fallbackContent.profile;
  const avatar = document.querySelector('.avatar');
  avatar.textContent = profile.initials || 'LG';
  avatar.setAttribute('aria-label', `${profile.name || 'Profile'} initials`);
  if (profile.avatar) {
    avatar.style.backgroundImage = `url("${profile.avatar}")`;
    avatar.style.backgroundSize = 'cover';
    avatar.style.backgroundPosition = 'center';
    avatar.style.color = 'transparent';
  }
  document.querySelector('h1').textContent = profile.name || '';
  document.querySelector('.site-name').textContent = profile.name || 'Portfolio';
  document.querySelector('.job-title').textContent = profile.role || '';
  document.querySelector('.company').textContent = profile.company || '';

  const bio = document.querySelector('.intro-copy');
  bio.replaceChildren(...(profile.bio || []).map((paragraph) => element('p', paragraph)));
  const contact = document.querySelector('.intro-links');
  contact.replaceChildren();
  if (profile.email) {
    const emailLink = element('a', 'Email', 'profile-link email-link');
    emailLink.href = `mailto:${profile.email}`;
    contact.append(emailLink);
  }
  if (profile.scholar_url) {
    const scholarLink = element('a', 'Google Scholar', 'profile-link scholar-link');
    scholarLink.href = profile.scholar_url;
    scholarLink.target = '_blank';
    scholarLink.rel = 'noopener noreferrer';
    contact.append(scholarLink);
  }
  if (!profile.email && !profile.scholar_url && profile.contact_note) {
    contact.append(element('span', profile.contact_note, 'contact-pending'));
  }

  const newsList = document.querySelector('.news-list');
  newsList.replaceChildren(...(content.news || []).map((item) => {
    const entry = element('article');
    entry.append(element('time', item.date), element('p', item.text));
    return entry;
  }));

  const publications = document.querySelector('.publication-list');
  const publicationItems = content.publications || [];
  if (!publicationItems.length) {
    const empty = element('article', '', 'publication-card publication-empty');
    empty.append(element('div', '', 'publication-cover publication-cover-fallback'), element('p', 'Publication entries will appear here.'));
    publications.replaceChildren(empty);
  } else {
    publications.replaceChildren(...publicationItems.map((item, index) => {
      const card = element('article', '', 'publication-card');
      const cover = element('div', '', `publication-cover publication-cover-${index % 3}`);
      if (item.image) {
        cover.style.backgroundImage = `url("${item.image}")`;
        cover.style.backgroundSize = 'cover';
        cover.style.backgroundPosition = 'center';
      }
      const info = element('div', '', 'publication-info');
      info.append(element('h3', item.title));
      if (item.authors) info.append(element('p', item.authors, 'publication-authors'));
      if (item.venue) info.append(element('p', item.venue, 'publication-venue'));
      if (item.author_note) info.append(element('p', item.author_note, 'author-note'));
      if (item.pdf_url) {
        const pdf = projectLink(item.pdf_url, 'Read PDF');
        pdf.className = 'publication-pdf';
        info.append(pdf);
      }
      card.append(cover, info);
      return card;
    }));
  }

  const projects = document.querySelector('.project-list');
  const projectItems = content.projects || [];
  if (!projectItems.length) {
    const empty = element('article', '', 'project-placeholder empty-project');
    empty.append(element('div', '', 'project-art art-one'), element('p', 'Selected project details coming soon.'));
    projects.replaceChildren(empty);
  } else {
    projects.replaceChildren(...projectItems.map((item, index) => {
      const card = element('article', '', 'project-placeholder');
      const art = element('div', '', `project-art ${index % 2 ? 'art-two' : 'art-one'}`);
      if (item.image) {
        art.style.backgroundImage = `url("${item.image}")`;
        art.style.backgroundSize = 'cover';
        art.style.backgroundPosition = 'center';
      }
      card.append(art, element('h3', item.title));
      if (item.meta) card.append(element('p', item.meta, 'project-meta'));
      if (item.description) card.append(element('p', item.description, 'project-description'));
      const links = [];
      if (item.video_url) links.push(projectLink(item.video_url, 'Video'));
      if (item.paper_url) links.push(projectLink(item.paper_url, 'Paper'));
      if (item.news_url) links.push(projectLink(item.news_url, 'News'));
      if (item.web_url) links.push(projectLink(item.web_url, 'Website'));
      if (links.length) {
        const projectLinks = element('div', '', 'project-links');
        projectLinks.append(...links);
        card.append(projectLinks);
      }
      return card;
    }));
  }

  const timeline = document.querySelector('.timeline');
  timeline.replaceChildren(...(content.experience || []).map((item) => {
    const entry = element('article', '', `timeline-entry${item.current ? ' active' : ''}`);
    entry.append(element('span', '', 'timeline-dot'), element('time', item.period), element('h3', item.title), element('p', item.organization));
    if (item.detail) entry.append(element('p', item.detail));
    return entry;
  }));
}

function projectLink(url, label) {
  const link = element('a', label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}

async function loadContent() {
  try {
    const response = await fetch('content/site.json');
    if (!response.ok) throw new Error('Content file unavailable');
    return await response.json();
  } catch (_) {
    return fallbackContent;
  }
}

const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

loadContent().then(renderSite);
