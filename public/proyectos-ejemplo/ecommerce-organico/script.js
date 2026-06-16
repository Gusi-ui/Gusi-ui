const products = [
  { id: 1, name: 'Tomates ecológicos', price: 3.2, unit: 'kg', category: 'fruta', description: 'De invernadero local, caja de 2 kg.', image: '🍅' },
  { id: 2, name: 'Manzanas Golden', price: 2.8, unit: 'kg', category: 'fruta', description: 'Cultivo sin pesticidas certificado.', image: '🍎' },
  { id: 3, name: 'Arroz integral bio', price: 4.5, unit: 'ud', category: 'despensa', description: 'Paquete de 1 kg, comercio justo.', image: '🌾' },
  { id: 4, name: 'Aceite de oliva virgen', price: 9.9, unit: 'ud', category: 'despensa', description: 'Botella 500 ml, primera presión.', image: '🫒' },
  { id: 5, name: 'Jabón artesanal', price: 5.5, unit: 'ud', category: 'higiene', description: 'Sin plásticos, lavanda natural.', image: '🧼' },
  { id: 6, name: 'Huevos camperos x12', price: 4.2, unit: 'ud', category: 'despensa', description: 'Gallinas en libertad, entrega semanal.', image: '🥚' },
  { id: 7, name: 'Espinacas frescas', price: 2.4, unit: 'kg', category: 'fruta', description: 'Cosechadas el mismo día.', image: '🥬' },
  { id: 8, name: 'Champú sólido', price: 7.0, unit: 'ud', category: 'higiene', description: 'Fórmula vegan y compostable.', image: '🧴' },
];

let cart = JSON.parse(localStorage.getItem('ecomercado_cart') || '[]');

const formatPrice = (n) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const saveCart = () => localStorage.setItem('ecomercado_cart', JSON.stringify(cart));

const updateCartCount = () => {
  const el = document.getElementById('cartCount');
  if (el) el.textContent = String(cart.reduce((s, i) => s + i.quantity, 0));
};

const showToast = (msg) => {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2800);
};

const renderProducts = (filter = 'all') => {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const list = filter === 'all' ? products : products.filter((p) => p.category === filter);
  grid.innerHTML = list
    .map(
      (p) => `
    <article class="product-card">
      <div class="product-image">${p.image}</div>
      <div class="product-info">
        <span class="badge-bio">BIO</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-footer">
          <span class="price">${formatPrice(p.price)}/${p.unit}</span>
          <button type="button" class="btn-add" data-id="${p.id}">Añadir</button>
        </div>
      </div>
    </article>`,
    )
    .join('');

  grid.querySelectorAll('.btn-add').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const product = products.find((x) => x.id === id);
      const qty = product.unit === 'kg' ? 0.5 : 1;
      const item = cart.find((x) => x.id === id);
      if (item) item.quantity += qty;
      else cart.push({ ...product, quantity: qty });
      saveCart();
      updateCartCount();
      showToast(`${product.name} añadido (${qty} ${product.unit})`);
    });
  });
};

const renderCart = () => {
  const body = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!body || !totalEl) return;
  if (!cart.length) {
    body.innerHTML = '<p class="empty-cart">Tu cesta está vacía</p>';
    totalEl.textContent = formatPrice(0);
    return;
  }
  let total = 0;
  body.innerHTML = cart
    .map((item) => {
      const line = item.price * item.quantity;
      total += line;
      return `<div class="cart-item">
        <span>${item.image} ${item.name} — ${item.quantity} ${item.unit}</span>
        <span>${formatPrice(line)}</span>
      </div>`;
    })
    .join('');
  totalEl.textContent = formatPrice(total);
};

window.toggleCart = () => {
  document.getElementById('cartModal')?.classList.toggle('active');
  renderCart();
};

window.checkout = () => {
  if (!cart.length) {
    showToast('Añade productos a la cesta');
    return;
  }
  showToast('Pedido semanal registrado ✓ Recogida el sábado');
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
  toggleCart();
};

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartCount();
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.category || 'all');
    });
  });
  document.querySelector('.cart-close')?.addEventListener('click', toggleCart);
});
