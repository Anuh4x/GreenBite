/* -------------------------------------------------------
   GreenBite Recipes Page (data-driven)
   - Reads data from window.RECIPES (recipes.data.js)
   - Search by name + filter by category
   - Modal with UL ingredients, OL steps, and TABLE nutrition
   - Keeps your glassmorphism theme
---------------------------------------------------------*/

// A safe SVG placeholder (used ONLY if a recipe has no image set)
function placeholder(title) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="680">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#2f6f39"/>
          <stop offset="100%" stop-color="#0b2d1a"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <g font-family="system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif" fill="#ffffff">
        <text x="50%" y="52%" text-anchor="middle" font-size="64" font-weight="700">${title}</text>
      </g>
    </svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

// ——— DOM ———
const grid = document.getElementById('recipesGrid');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');
const filtersWrap = document.getElementById('categoryFilters');

const modal = document.getElementById('recipeModal');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

let ALL = Array.isArray(window.RECIPES) ? window.RECIPES : [];
let currentCategory = 'All';
let currentSearch = '';

// Build filter chips from categories in data
function renderFilters() {
  const cats = ['All', ...Array.from(new Set(ALL.map(r => r.category)))];
  filtersWrap.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === currentCategory ? ' active' : '');
    btn.type = 'button';
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      currentCategory = cat;
      [...filtersWrap.querySelectorAll('.filter-btn')].forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid();
    });
    filtersWrap.appendChild(btn);
  });
}

// Filtering logic
function applyFilters() {
  const term = currentSearch.trim().toLowerCase();
  return ALL.filter(r => {
    const byCat = currentCategory === 'All' || r.category === currentCategory;
    const byName = !term || r.title.toLowerCase().includes(term);
    return byCat && byName;
  });
}

// Render the cards
function renderGrid() {
  const list = applyFilters();
  grid.innerHTML = '';
  emptyState.classList.toggle('hidden', list.length > 0);

  list.forEach(r => {
    const src = r.image && r.image.length ? r.image : placeholder(r.title);
    const card = document.createElement('article');
    card.className = 'card recipe-card reveal';
    card.innerHTML = `
      <img src="${src}" alt="${r.title}">
      <div class="meta">
        <span class="badge">${r.category}</span>
        <span class="muted">${Math.round(r.nutrition?.cal ?? 0)} cal</span>
      </div>
      <h3 class="title">${r.title}</h3>
      <p class="desc">${r.desc}</p>
      <button class="btn open-btn" data-id="${r.id}">View Recipe</button>
    `;
    card.querySelector('.open-btn').addEventListener('click', () => openModal(r.id));
    grid.appendChild(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  });
}

// Modal
function openModal(id) {
  const r = ALL.find(x => x.id === id);
  if (!r) return;

  const src = r.image && r.image.length ? r.image : placeholder(r.title);
  const n = r.nutrition || { cal: 0, protein: 0, carbs: 0, fat: 0 };

  modalContent.innerHTML = `
    <div class="container">
      <h2 style="color:var(--heading); margin-top:.2rem">${r.title}</h2>
      <p class="muted" style="margin:.2rem 0 1rem">${r.desc}</p>

      <img src="${src}" alt="${r.title}" style="width:100%; max-height:340px; object-fit:cover; border-radius:.8rem;">

      <div class="form-row" style="margin-top:1.2rem">
        <section>
          <h3>Ingredients</h3>
          <ul>
            ${(r.ingredients || []).map(i => `<li>${i}</li>`).join('')}
          </ul>
        </section>

        <section>
          <h3>Steps</h3>
          <ol>
            ${(r.steps || []).map(s => `<li>${s}</li>`).join('')}
          </ol>
        </section>
      </div>

      <section style="margin-top:1rem">
        <h3>Nutrition (per serving)</h3>
        <table>
          <thead>
            <tr><th>Calories</th><th>Protein (g)</th><th>Carbs (g)</th><th>Fat (g)</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>${n.cal}</td>
              <td>${n.protein}</td>
              <td>${n.carbs}</td>
              <td>${n.fat}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  `;

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Wire up events
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  renderGrid();
});
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// Boot
renderFilters();
renderGrid();
