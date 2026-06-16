// TechStore Online - productos demo
const products = [
  { id: 1, name: 'Auriculares ANC Pro', price: 129.99, category: 'audio', description: 'Cancelación activa de ruido y 30 h de batería.', image: '🎧' },
  { id: 2, name: 'Altavoz Bluetooth 360°', price: 79.5, category: 'audio', description: 'Sonido envolvente resistente al agua IPX7.', image: '🔊' },
  { id: 3, name: 'Teclado Mecánico RGB', price: 89.0, category: 'perifericos', description: 'Switches silenciosos y reposamuñecas magnético.', image: '⌨️' },
  { id: 4, name: 'Ratón Ergonómico Pro', price: 54.99, category: 'perifericos', description: 'Sensor 26K DPI y 8 botones programables.', image: '🖱️' },
  { id: 5, name: 'Webcam 4K Streaming', price: 119.0, category: 'perifericos', description: 'Autofoco y micrófono dual integrado.', image: '📷' },
  { id: 6, name: 'Bombilla WiFi RGB', price: 24.99, category: 'smarthome', description: 'Compatible con Alexa y Google Home.', image: '💡' },
  { id: 7, name: 'Enchufe Inteligente', price: 18.5, category: 'smarthome', description: 'Programación horaria y monitor de consumo.', image: '🔌' },
  { id: 8, name: 'Hub USB-C 7 en 1', price: 49.99, category: 'perifericos', description: 'HDMI 4K, SD y carga rápida 100W.', image: '🔗' },
];

let cart = JSON.parse(localStorage.getItem('techstore_cart') || '[]');

const formatPrice = (n) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);

const saveCart = () => localStorage.setItem('techstore_cart', JSON.stringify(cart));

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
    <article class="product-card" data-category="${p.category}">
      <div class="product-image">${p.image}</div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-footer">
          <span class="price">${formatPrice(p.price)}</span>
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
      const item = cart.find((x) => x.id === id);
      if (item) item.quantity += 1;
      else cart.push({ ...product, quantity: 1 });
      saveCart();
      updateCartCount();
      showToast(`${product.name} añadido al carrito`);
    });
  });
};

const renderCart = () => {
  const body = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!body || !totalEl) return;
  if (!cart.length) {
    body.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
    totalEl.textContent = formatPrice(0);
    return;
  }
  let total = 0;
  body.innerHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      return `<div class="cart-item">
        <span>${item.image} ${item.name} × ${item.quantity}</span>
        <span>${formatPrice(item.price * item.quantity)}</span>
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
    showToast('Añade productos antes de pagar');
    return;
  }
  showToast('Pago simulado con Stripe ✓');
  cart = [];
  saveCart();
  updateCartCount();
  renderCart();
  toggleCart();
};

window.scrollToProducts = () =>
  document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' });

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
