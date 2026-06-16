const menuItems = [
    { id: 1, name: 'Espresso', desc: 'Café intenso de origen único', price: 1.80, category: 'cafe', emoji: '☕', allergens: ['lacteos'] },
    { id: 2, name: 'Cappuccino', desc: 'Espresso con leche espumada y cacao', price: 2.50, category: 'cafe', emoji: '☕', allergens: ['lacteos'] },
    { id: 3, name: 'Flat White', desc: 'Doble espresso con microespuma de leche', price: 2.80, category: 'cafe', emoji: '🥛', allergens: ['lacteos'] },
    { id: 4, name: 'Croissant', desc: 'Mantequilla francesa, horneado diario', price: 2.20, category: 'pasteleria', emoji: '🥐', allergens: ['gluten', 'lacteos'] },
    { id: 5, name: 'Tarta de zanahoria', desc: 'Con frosting de queso crema y nueces', price: 3.50, category: 'pasteleria', emoji: '🍰', allergens: ['gluten', 'lacteos', 'frutos'] },
    { id: 6, name: 'Tostada aguacate', desc: 'Pan artesano, aguacate y semillas', price: 4.50, category: 'desayunos', emoji: '🥑', allergens: ['gluten', 'frutos'] },
    { id: 7, name: 'Bowl de açaí', desc: 'Açaí, granola sin gluten y frutas', price: 6.90, category: 'desayunos', emoji: '🫐', allergens: ['frutos'] },
    { id: 8, name: 'Zumo natural', desc: 'Naranja recién exprimida', price: 3.00, category: 'bebidas', emoji: '🍊', allergens: [] },
    { id: 9, name: 'Limonada casera', desc: 'Limón, menta y jengibre', price: 3.20, category: 'bebidas', emoji: '🍋', allergens: [] },
    { id: 10, name: 'Ensalada mediterránea', desc: 'Quinoa, tomate, aceitunas y feta', price: 7.50, category: 'ensaladas', emoji: '🥗', allergens: ['lacteos'] },
];

const categories = [
    { id: 'all', label: 'Todo' },
    { id: 'cafe', label: 'Café' },
    { id: 'pasteleria', label: 'Pastelería' },
    { id: 'desayunos', label: 'Desayunos' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'ensaladas', label: 'Ensaladas' },
];

const ALLERGEN_LABELS = { gluten: 'Gluten', lacteos: 'Lácteos', frutos: 'Frutos secos' };

let cart = {};
let activeCategory = 'all';
let activeAllergenFilter = 'all';

const formatPrice = (n) => n.toFixed(2).replace('.', ',') + ' €';

const getCartCount = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);

const getCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = menuItems.find((m) => m.id === parseInt(id, 10));
        return sum + (item ? item.price * qty : 0);
    }, 0);
};

const renderCategories = () => {
    const nav = document.getElementById('categories');
    nav.innerHTML = categories.map((c) =>
        `<button type="button" class="cat-btn ${c.id === activeCategory ? 'active' : ''}" data-cat="${c.id}">${c.label}</button>`
    ).join('');

    nav.querySelectorAll('.cat-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            activeCategory = btn.dataset.cat;
            renderCategories();
            renderMenu();
        });
    });
};

const passesAllergenFilter = (item) => {
    if (activeAllergenFilter === 'all') return true;
    return !item.allergens.includes(activeAllergenFilter);
};

const renderMenu = () => {
    const grid = document.getElementById('menuGrid');
    grid.innerHTML = menuItems.map((item) => {
        const show = (activeCategory === 'all' || item.category === activeCategory) && passesAllergenFilter(item);
        const allergenTags = item.allergens.map((a) => `<span class="allergen-tag">${ALLERGEN_LABELS[a]}</span>`).join('');

        return `
            <article class="menu-item ${show ? '' : 'hidden'}" data-id="${item.id}">
                <div class="item-image">${item.emoji}</div>
                <div class="item-body">
                    <h3>${item.name}</h3>
                    <p class="item-desc">${item.desc}</p>
                    ${item.allergens.length ? `<div class="allergens">${allergenTags}</div>` : ''}
                    <div class="item-footer">
                        <span class="price">${formatPrice(item.price)}</span>
                        <button type="button" class="add-btn" data-add="${item.id}">Añadir</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    grid.querySelectorAll('[data-add]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.add, 10);
            cart[id] = (cart[id] || 0) + 1;
            updateCartUI();
        });
    });
};

const updateCartUI = () => {
    document.getElementById('cartCount').textContent = getCartCount();
};

const renderCart = () => {
    const container = document.getElementById('cartItems');
    const entries = Object.entries(cart);

    if (!entries.length) {
        container.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
        document.getElementById('cartTotal').textContent = '0,00 €';
        return;
    }

    container.innerHTML = entries.map(([id, qty]) => {
        const item = menuItems.find((m) => m.id === parseInt(id, 10));
        if (!item) return '';
        return `
            <div class="cart-line">
                <div class="cart-line-info">
                    <h4>${item.name}</h4>
                    <span>${formatPrice(item.price)}</span>
                </div>
                <div class="qty-controls">
                    <button type="button" class="qty-btn" data-dec="${id}" aria-label="Reducir">−</button>
                    <span>${qty}</span>
                    <button type="button" class="qty-btn" data-inc="${id}" aria-label="Aumentar">+</button>
                </div>
            </div>
        `;
    }).join('');

    document.getElementById('cartTotal').textContent = formatPrice(getCartTotal());

    container.querySelectorAll('[data-inc]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.inc, 10);
            cart[id]++;
            renderCart();
            updateCartUI();
        });
    });

    container.querySelectorAll('[data-dec]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.dec, 10);
            cart[id]--;
            if (cart[id] <= 0) delete cart[id];
            renderCart();
            updateCartUI();
        });
    });
};

const initCartModal = () => {
    const modal = document.getElementById('cartModal');
    const openBtn = document.getElementById('cartBtn');
    const closeBtn = modal.querySelector('.modal-close');
    const confirmBtn = document.getElementById('confirmOrder');
    const orderNote = document.getElementById('orderNote');

    const open = () => { modal.hidden = false; renderCart(); orderNote.hidden = true; };
    const close = () => { modal.hidden = true; };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    confirmBtn.addEventListener('click', () => {
        if (!getCartCount()) return;
        orderNote.hidden = false;
        confirmBtn.disabled = true;
        setTimeout(() => {
            cart = {};
            updateCartUI();
            confirmBtn.disabled = false;
            close();
        }, 2000);
    });
};

const initAllergenFilters = () => {
    document.querySelectorAll('.filter-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            activeAllergenFilter = chip.dataset.allergen;
            renderMenu();
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    renderMenu();
    initCartModal();
    initAllergenFilters();
    updateCartUI();
});
