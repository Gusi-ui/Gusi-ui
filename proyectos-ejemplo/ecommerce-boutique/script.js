// Datos de productos
const products = [
    {
        id: 1,
        name: "Vestido Floral Elegante",
        price: 89.99,
        category: "vestidos",
        description: "Vestido midi con estampado floral, perfecto para ocasiones especiales.",
        image: "👗"
    },
    {
        id: 2,
        name: "Blusa de Seda Premium",
        price: 65.50,
        category: "blusas",
        description: "Blusa de seda natural con corte clásico y acabados de lujo.",
        image: "👚"
    },
    {
        id: 3,
        name: "Pantalón Wide Leg",
        price: 75.00,
        category: "pantalones",
        description: "Pantalón de corte ancho en tela fluida, cómodo y elegante.",
        image: "👖"
    },
    {
        id: 4,
        name: "Collar Dorado Vintage",
        price: 45.99,
        category: "accesorios",
        description: "Collar de cadena dorada con colgante vintage, acabado artesanal.",
        image: "📿"
    },
    {
        id: 5,
        name: "Vestido Cóctel Negro",
        price: 120.00,
        category: "vestidos",
        description: "Vestido negro de cóctel con detalles de encaje y corte ajustado.",
        image: "👗"
    },
    {
        id: 6,
        name: "Blusa Bordada Boho",
        price: 55.75,
        category: "blusas",
        description: "Blusa con bordados étnicos y mangas acampanadas, estilo bohemio.",
        image: "👚"
    },
    {
        id: 7,
        name: "Jeans Skinny Premium",
        price: 85.00,
        category: "pantalones",
        description: "Jeans de corte skinny en denim premium con elastano.",
        image: "👖"
    },
    {
        id: 8,
        name: "Bolso de Cuero Artesanal",
        price: 95.50,
        category: "accesorios",
        description: "Bolso de mano en cuero genuino con acabados artesanales.",
        image: "👜"
    },
    {
        id: 9,
        name: "Vestido Casual Rayas",
        price: 42.99,
        category: "vestidos",
        description: "Vestido casual con rayas marineras, perfecto para el día a día.",
        image: "👗"
    },
    {
        id: 10,
        name: "Pañuelo de Seda Estampado",
        price: 28.50,
        category: "accesorios",
        description: "Pañuelo de seda con estampado exclusivo, versátil y elegante.",
        image: "🧣"
    },
    {
        id: 11,
        name: "Blusa Transparente Chic",
        price: 68.00,
        category: "blusas",
        description: "Blusa semi-transparente con detalles metálicos, muy chic.",
        image: "👚"
    },
    {
        id: 12,
        name: "Pantalón Palazzo Fluido",
        price: 72.25,
        category: "pantalones",
        description: "Pantalón palazzo en tela fluida, cómodo y sofisticado.",
        image: "👖"
    }
];

// Carrito de compras
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const filterButtons = document.querySelectorAll('.filter-btn');
const contactForm = document.getElementById('contactForm');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Filtros de productos
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            
            // Actualizar botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }
    
    // Newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletter();
        });
    }
}

// Renderizar productos
function renderProducts(productsToRender = products) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    productsToRender.forEach((product, index) => {
        const productCard = createProductCard(product, index);
        productsGrid.appendChild(productCard);
    });
}

// Crear tarjeta de producto
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="product-image">
            <span style="font-size: 4rem;">${product.image}</span>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">€${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-bag"></i> Añadir al Carrito
            </button>
        </div>
    `;
    
    return card;
}

// Filtrar productos
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    renderProducts(filteredProducts);
}

// Añadir producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
    showNotification(`${product.name} añadido al carrito`, 'success');
}

// Remover producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCart();
}

// Actualizar cantidad en el carrito
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartUI();
        saveCart();
    }
}

// Actualizar UI del carrito
function updateCartUI() {
    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

// Actualizar contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Actualizar total del carrito
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

// Renderizar items del carrito
function renderCartItems() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu carrito está vacío</p>
                <p>¡Añade algunos productos!</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <span style="font-size: 1.5rem;">${item.image}</span>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">€${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: auto; background: #ff6b6b; color: white;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle carrito
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
    document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : 'auto';
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    showNotification(`¡Compra realizada! Total: €${total.toFixed(2)} (${itemCount} productos)`, 'success');
    
    // Limpiar carrito
    cart = [];
    updateCartUI();
    saveCart();
    toggleCart();
}

// Guardar carrito en localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Scroll suave a productos
function scrollToProducts() {
    const productsSection = document.getElementById('productos');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Manejar formulario de contacto
function handleContactForm() {
    const formData = new FormData(contactForm);
    const name = contactForm.querySelector('input[type="text"]').value;
    const email = contactForm.querySelector('input[type="email"]').value;
    const message = contactForm.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Simular envío
    const submitBtn = contactForm.querySelector('button');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('¡Mensaje enviado correctamente!', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Manejar newsletter
function handleNewsletter() {
    const email = document.querySelector('.newsletter-form input').value;
    
    if (!email || !isValidEmail(email)) {
        showNotification('Por favor, introduce un email válido', 'error');
        return;
    }
    
    showNotification('¡Suscripción exitosa! Recibirás nuestras novedades.', 'success');
    document.querySelector('.newsletter-form input').value = '';
}

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <span style="font-weight: bold;">${icon}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">&times;</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-family: 'Inter', sans-serif;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Navegación suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Efecto de header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = '#fff';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Cerrar carrito con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        toggleCart();
    }
});

// Búsqueda de productos (funcionalidad básica)
document.querySelector('.search-btn').addEventListener('click', function() {
    const searchTerm = prompt('¿Qué producto buscas?');
    if (searchTerm) {
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredProducts.length > 0) {
            renderProducts(filteredProducts);
            showNotification(`Se encontraron ${filteredProducts.length} productos`, 'success');
        } else {
            showNotification('No se encontraron productos', 'error');
        }
    }
});

// Animación de carga inicial
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

console.log('🛍️ E-Commerce Boutique cargado correctamente!');
console.log(`📦 ${products.length} productos disponibles`);
console.log(`🛒 ${cart.length} productos en el carrito`);