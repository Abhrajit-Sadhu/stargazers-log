function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch (e) {
    return iso;
  }
}

function renderStars(data, container) {
  container.innerHTML = '';
  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = '<div class="empty">No starred repositories found.</div>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'stars';

  data.forEach(item => {
    const li = document.createElement('li');
    li.className = 'repo-card';

    const a = document.createElement('a');
    a.className = 'repo-name';
    a.href = item.html_url || '#';
    a.textContent = item.repo_name || item.html_url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';

    const desc = document.createElement('p');
    desc.className = 'repo-desc';
    desc.textContent = item.description || '';

    const small = document.createElement('small');
    small.className = 'starred-at';
    small.textContent = item.starred_at ? ('Starred: ' + formatDate(item.starred_at)) : '';

    li.appendChild(a);
    if (desc.textContent) li.appendChild(desc);
    if (small.textContent) li.appendChild(small);

    ul.appendChild(li);
  });

  container.appendChild(ul);
}

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('starred-list');
  if (!container) return;

  fetch('events.json', {cache: 'no-store'})
    .then(resp => {
      if (!resp.ok) throw new Error('Network response was not ok');
      return resp.json();
    })
    .then(data => renderStars(data, container))
    .catch(err => {
      container.innerHTML = '<div class="empty">Could not load starred repositories.</div>';
      console.error('Failed to load events.json', err);
    });
});
