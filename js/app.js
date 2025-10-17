document.getElementById('year')?.append(new Date().getFullYear());

// aqui le agrgue para cambiar el tema, algo un poco sencillo
const btnTheme = document.getElementById('themeToggle');
if (btnTheme){
  btnTheme.addEventListener('click', () => {
    const html = document.documentElement;
    const current = html.getAttribute('data-bs-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-bs-theme', next);
    btnTheme.setAttribute('aria-pressed', String(next === 'dark'));
  });
}
// aqui la importancicion de datos dinamicos
import { IMAGES, CATEGORIES } from '../assets/data/images.js';

const qs = (sel, sc=document) => sc.querySelector(sel);
const qsa = (sel, sc=document) => [...sc.querySelectorAll(sel)];

// esta parte coloque el render de destacndos

(function renderFeatured(){
  const wrap = qs('#featured');
  if (!wrap) return;
  const featured = IMAGES.slice(0, 6);
  const html = featured.map(img => `
    <div class="col-sm-6 col-lg-4">
      <div class="card h-100 shadow-sm">
        <img src="${img.src}" class="card-img-top" alt="${img.alt}">
        <div class="card-body d-flex flex-column">
          <h3 class="h5 card-title">${img.title}</h3>
          <p class="card-text small text-secondary mb-3">${img.description}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <span class="badge text-bg-success">${img.category}</span>
            <a class="btn btn-sm btn-outline-primary" href="detalle.html?id=${img.id}">Ver detalle</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
  wrap.innerHTML = html;

  const pills = qs('#categoryPills');
  if (pills){
    const cats = ['Todos', ...CATEGORIES];
    pills.innerHTML = cats.map(c => `<a href="galeria.html#${encodeURIComponent(c)}" class="btn btn-outline-primary">${c}</a>`).join('');
  }
})();
// Aca la galeriea con filtros
(function renderGallery(){
  const grid = qs('#gallery');
  const filters = qs('#filters');
  if (!grid || !filters) return;

  const cats = ['Todos', ...CATEGORIES];
  filters.innerHTML = cats.map((c, i) => `
    <input type="radio" class="btn-check" name="filter" id="f${i}" autocomplete="off" ${i===0?'checked':''}>
    <label class="btn btn-outline-primary" for="f${i}" data-cat="${c}">${c}</label>
  `).join('');

  const draw = (list) => {
    grid.innerHTML = list.map(img => `
      <div class="col-6 col-md-4 col-lg-3">
        <a class="text-decoration-none" href="detalle.html?id=${img.id}" aria-label="Ver detalle de ${img.title}">
          <img class="thumb shadow-sm" src="${img.src}" alt="${img.alt}">
          <div class="pt-2 small d-flex justify-content-between">
            <span class="text-body fw-medium">${img.title}</span>
            <span class="badge text-bg-success">${img.category}</span>
          </div>
        </a>
      </div>
    `).join('');
  };
  draw(IMAGES);

  filters.addEventListener('click', (e) => {
    const lab = e.target.closest('label[data-cat]');
    if (!lab) return;
    const cat = lab.dataset.cat;
    if (cat === 'Todos') return draw(IMAGES);
    draw(IMAGES.filter(i => i.category === cat));
  });


  const hashCat = decodeURIComponent(location.hash.replace('#',''));
  if (hashCat && cats.includes(hashCat)){
    const idx = cats.indexOf(hashCat);
    qs(`#f${idx}`).checked = true;
    draw(hashCat === 'Todos' ? IMAGES : IMAGES.filter(i => i.category === hashCat));
  }
})();
// Vista de detalle
(function renderDetail(){
  const wrap = qs('#detailContainer');
  if (!wrap) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const item = IMAGES.find(i => i.id === id) || IMAGES[0];
  if (!item) return;

  wrap.innerHTML = `
    <div class="col-lg-7">
      <img class="img-fluid rounded-4 shadow-sm w-100" src="${item.src}" alt="${item.alt}">
    </div>
    <div class="col-lg-5">
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="h4 mb-2">${item.title}</h1>
          <span class="badge text-bg-success mb-3">${item.category}</span>
          <p>${item.description}</p>
          <p class="small text-secondary mb-0"><strong>Autor:</strong> ${item.author}</p>
        </div>
      </div>
      <a class="btn btn-outline-primary mt-3" href="galeria.html#${encodeURIComponent(item.category)}">Volver a galería</a>
    </div>
  `;
})();
// En esta parte la validacion del formulario
(function handleContact(){
  const form = qs('#contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()){
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault();
      const toastEl = document.getElementById('contactToast');
      if (toastEl){
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl);
        toast.show();
      }
      form.reset();
      form.classList.remove('was-validated');
      return;
    }
    form.classList.add('was-validated');
  }, false);
})();
