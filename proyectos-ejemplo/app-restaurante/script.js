// Datos del menú
const menuItems = [
    {
        id: 1,
        name: "Hummus Tradicional",
        price: 8.50,
        category: "entrantes",
        description: "Crema de garbanzos con tahini, aceite de oliva virgen extra y especias mediterráneas",
        emoji: "🧄",
        tags: ["vegetarian"],
        popular: true
    },
    {
        id: 2,
        name: "Bruschetta de Tomate",
        price: 9.00,
        category: "entrantes",
        description: "Pan tostado con tomate fresco, albahaca, ajo y aceite de oliva",
        emoji: "🍅",
        tags: ["vegetarian"]
    },
    {
        id: 3,
        name: "Tabla de Quesos Artesanales",
        price: 16.50,
        category: "entrantes",
        description: "Selección de quesos mediterráneos con miel, nueces y mermelada casera",
        emoji: "🧀",
        tags: ["vegetarian"]
    },
    {
        id: 4,
        name: "Aceitunas Marinadas",
        price: 6.00,
        category: "entrantes",
        description: "Aceitunas verdes y negras marinadas con hierbas aromáticas",
        emoji: "🫒",
        tags: ["vegetarian"]
    },
    {
        id: 5,
        name: "Paella Valenciana",
        price: 24.00,
        category: "principales",
        description: "Arroz bomba con pollo, conejo, judías verdes, garrofón y azafrán",
        emoji: "🥘",
        tags: [],
        popular: true
    },
    {
        id: 6,
        name: "Lubina a la Sal",
        price: 22.50,
        category: "principales",
        description: "Lubina fresca cocinada en costra de sal con verduras de temporada",
        emoji: "🐟",
        tags: []
    },
    {
        id: 7,
        name: "Cordero Lechal Asado",
        price: 26.00,
        category: "principales",
        description: "Cordero lechal asado con patatas panaderas y hierbas aromáticas",
        emoji: "🍖",
        tags: []
    },
    {
        id: 8,
        name: "Risotto de Setas",
        price: 18.50,
        category: "principales",
        description: "Arroz cremoso con setas de temporada, parmesano y trufa",
        emoji: "🍄",
        tags: ["vegetarian"]
    },
    {
        id: 9,
        name: "Pasta Puttanesca",
        price: 16.00,
        category: "principales",
        description: "Espaguetis con tomate, aceitunas, alcaparras, anchoas y ajo",
        emoji: "🍝",
        tags: []
    },
    {
        id: 10,
        name: "Moussaka Griega",
        price: 19.50,
        category: "principales",
        description: "Capas de berenjena, carne picada y bechamel gratinada",
        emoji: "🍆",
        tags: []
    },
    {
        id: 11,
        name: "Tiramisu Casero",
        price: 7.50,
        category: "postres",
        description: "Postre italiano con mascarpone, café, cacao y bizcochos de soletilla",
        emoji: "🍰",
        tags: ["vegetarian"],
        popular: true
    },
    {
        id: 12,
        name: "Baklava de Pistachos",
        price: 6.50,
        category: "postres",
        description: "Hojaldre crujiente con pistachos, miel y agua de azahar",
        emoji: "🥜",
        tags: ["vegetarian"]
    },
    {
        id: 13,
        name: "Panna Cotta de Limón",
        price: 6.00,
        category: "postres",
        description: "Crema italiana con limón mediterráneo y coulis de frutos rojos",
        emoji: "🍋",
        tags: ["vegetarian"]
    },
    {
        id: 14,
        name: "Helado Artesanal",
        price: 5.50,
        category: "postres",
        description: "Tres bolas de helado artesanal: vainilla, chocolate y pistacho",
        emoji: "🍨",
        tags: ["vegetarian"]
    },
    {
        id: 15,
        name: "Vino Tinto Reserva",
        price: 4.50,
        category: "bebidas",
        description: "Copa de vino tinto reserva de la Ribera del Duero",
        emoji: "🍷",
        tags: []
    },
    {
        id: 16,
        name: "Sangría de la Casa",
        price: 5.00,
        category: "bebidas",
        description: "Sangría tradicional con frutas frescas y especias",
        emoji: "🍹",
        tags: [],
        popular: true
    },
    {
        id: 17,
        name: "Agua Mineral",
        price: 2.50,
        category: "bebidas",
        description: "Agua mineral natural con o sin gas",
        emoji: "💧",
        tags: []
    },
    {
        id: 18,
        name: "Café Espresso",
        price: 2.00,
        category: "bebidas",
        description: "Café espresso italiano recién molido",
        emoji: "☕",
        tags: []
    },
    {
        id: 19,
        name: "Zumo Natural",
        price: 4.00,
        category: "bebidas",
        description: "Zumo natural de naranja, limón o granada",
        emoji: "🧃",
        tags: ["vegetarian"]
    },
    {
        id: 20,
        name: "Cerveza Artesanal",
        price: 3.50,
        category: "bebidas",
        description: "Cerveza artesanal mediterránea de barril",
        emoji: "🍺",
        tags: []
    }
];

// Carrito de pedidos
let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

// Elementos del DOM
const menuGrid = document.getElementById('menuGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const filterButtons = document.querySelectorAll('.filter-btn');
const reservationForm = document.getElementById('reservationForm');
const contactForm = document.getElementById('contactForm');

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    updateCartUI();
    setupEventListeners();
    setMinDate();
});

// Configurar event listeners
function setupEventListeners() {
    // Filtros del menú
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterMenu(category);
            
            // Actualizar botón activo
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Formulario de reservas
    if (reservationForm) {
        reservationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleReservation();
        });
    }
    
    // Formulario de contacto
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContact();
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

// Establecer fecha mínima para reservas
function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

// Renderizar menú
function renderMenu(itemsToRender = menuItems) {
    if (!menuGrid) return;
    
    menuGrid.innerHTML = '';
    
    itemsToRender.forEach((item, index) => {
        const menuCard = createMenuCard(item, index);
        menuGrid.appendChild(menuCard);
    });
}

// Crear tarjeta de menú
function createMenuCard(item, index) {
    const card = document.createElement('div');
    card.className = 'menu-item';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const popularBadge = item.popular ? '<span class="tag" style="background: #f39c12; color: white; border-color: #f39c12;">Popular</span>' : '';
    
    const tagsHTML = item.tags.map(tag => 
        `<span class="tag ${tag}">${getTagLabel(tag)}</span>`
    ).join('');
    
    card.innerHTML = `
        <div class="menu-item-header">
            <div class="menu-item-emoji">${item.emoji}</div>
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">€${item.price.toFixed(2)}</div>
            </div>
        </div>
        <div class="menu-item-description">${item.description}</div>
        <div class="menu-item-footer">
            <div class="menu-item-tags">
                ${popularBadge}
                ${tagsHTML}
            </div>
            <button class="add-to-cart" onclick="addToCart(${item.id})">
                <i class="fas fa-plus"></i> Añadir
            </button>
        </div>
    `;
    
    return card;
}

// Obtener etiqueta de tag
function getTagLabel(tag) {
    const labels = {
        'vegetarian': '🌱 Vegetariano',
        'spicy': '🌶️ Picante',
        'gluten-free': '🌾 Sin Gluten'
    };
    return labels[tag] || tag;
}

// Filtrar menú
function filterMenu(category) {
    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category === category);
    
    renderMenu(filteredItems);
}

// Añadir al carrito
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...item,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCart();
    showNotification(`${item.name} añadido al pedido`, 'success');
}

// Remover del carrito
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    saveCart();
}

// Actualizar cantidad
function updateQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(itemId);
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
                <i class="fas fa-utensils"></i>
                <p>Tu pedido está vacío</p>
                <p>¡Añade algunos platos deliciosos!</p>
            </div>
        `;
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <span>${item.emoji}</span>
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
                    <button class="quantity-btn" onclick="removeFromCart(${item.id})" 
                            style="margin-left: auto; background: #e74c3c; color: white; border-color: #e74c3c;">
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

// Toggle menú móvil
function toggleMobileMenu() {
    // Implementación básica para menú móvil
    showNotification('Menú móvil - Funcionalidad en desarrollo', 'info');
}

// Finalizar pedido
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu pedido está vacío', 'error');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Simular procesamiento del pedido
    const checkoutBtn = document.querySelector('.cart-footer .btn');
    const originalText = checkoutBtn.innerHTML;
    
    checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    checkoutBtn.disabled = true;
    
    setTimeout(() => {
        showNotification(`¡Pedido confirmado! Total: €${total.toFixed(2)} (${itemCount} platos)\nTiempo estimado: 25-30 minutos`, 'success');
        
        // Limpiar carrito
        cart = [];
        updateCartUI();
        saveCart();
        toggleCart();
        
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.disabled = false;
    }, 2000);
}

// Guardar carrito
function saveCart() {
    localStorage.setItem('restaurantCart', JSON.stringify(cart));
}

// Scroll a secciones
function scrollToMenu() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
}

function scrollToReservations() {
    document.getElementById('reservas').scrollIntoView({ behavior: 'smooth' });
}

// Manejar reserva
function handleReservation() {
    const formData = new FormData(reservationForm);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        guests: formData.get('guests'),
        notes: formData.get('notes')
    };
    
    // Validación básica
    if (!data.name || !data.phone || !data.date || !data.time || !data.guests) {
        showNotification('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    // Validar fecha
    const selectedDate = new Date(data.date);
    const today = new Date();
    if (selectedDate <= today) {
        showNotification('La fecha debe ser posterior a hoy', 'error');
        return;
    }
    
    // Simular envío
    const submitBtn = reservationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const formattedDate = new Date(data.date).toLocaleDateString('es-ES');
        showNotification(
            `¡Reserva confirmada!\n${data.name} - ${data.guests} personas\n${formattedDate} a las ${data.time}\n\nRecibirás un SMS de confirmación`, 
            'success'
        );
        
        reservationForm.reset();
        setMinDate(); // Restablecer fecha mínima
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

// Manejar contacto
function handleContact() {
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    if (!data.name || !data.email || !data.subject || !data.message) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    if (!isValidEmail(data.email)) {
        showNotification('Por favor, introduce un email válido', 'error');
        return;
    }
    
    // Simular envío
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        showNotification('¡Mensaje enviado correctamente! Te responderemos pronto.', 'success');
        contactForm.reset();
        
        submitBtn.innerHTML = originalText;
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
    
    showNotification('¡Suscripción exitosa! Recibirás nuestras ofertas especiales.', 'success');
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
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 0.75rem;">
            <span style="font-weight: bold; font-size: 1.2rem;">${icon}</span>
            <div style="flex: 1;">
                <div style="white-space: pre-line;">${message}</div>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; padding: 0; margin-left: 0.5rem;">
                &times;
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    notification.remove();
                }
            }, 300);
        }
    }, 6000);
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
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Cerrar carrito con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('active')) {
        toggleCart();
    }
});

// Animaciones al hacer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observar elementos del menú
setTimeout(() => {
    document.querySelectorAll('.menu-item').forEach(item => {
        observer.observe(item);
    });
}, 100);

// Funcionalidad de búsqueda básica
function searchMenu() {
    const searchTerm = prompt('¿Qué plato buscas?');
    if (searchTerm) {
        const filteredItems = menuItems.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        if (filteredItems.length > 0) {
            renderMenu(filteredItems);
            showNotification(`Se encontraron ${filteredItems.length} platos`, 'success');
            
            // Resetear filtros
            filterButtons.forEach(btn => btn.classList.remove('active'));
        } else {
            showNotification('No se encontraron platos con ese término', 'error');
        }
    }
}

// Recomendaciones del chef
function showChefRecommendations() {
    const popularItems = menuItems.filter(item => item.popular);
    renderMenu(popularItems);
    showNotification('Mostrando recomendaciones del chef', 'success');
    
    // Resetear filtros
    filterButtons.forEach(btn => btn.classList.remove('active'));
}

// Información nutricional (simulada)
function showNutritionalInfo(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
        const info = `Información nutricional de ${item.name}:\n\n• Calorías: ${Math.floor(Math.random() * 400 + 200)} kcal\n• Proteínas: ${Math.floor(Math.random() * 30 + 10)}g\n• Carbohidratos: ${Math.floor(Math.random() * 50 + 20)}g\n• Grasas: ${Math.floor(Math.random() * 20 + 5)}g`;
        showNotification(info, 'info');
    }
}

// Tiempo de preparación estimado
function getPreparationTime(category) {
    const times = {
        'entrantes': '10-15 min',
        'principales': '20-25 min',
        'postres': '5-10 min',
        'bebidas': '2-5 min'
    };
    return times[category] || '15-20 min';
}

// Animación de carga inicial
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Log de inicialización
console.log('🍽️ Restaurante Sabor Mediterráneo cargado correctamente!');
console.log(`📋 ${menuItems.length} platos en el menú`);
console.log(`🛒 ${cart.length} platos en el pedido actual`);

// Datos de ejemplo para testing
if (window.location.hostname === 'localhost') {
    window.restaurantApp = {
        menuItems,
        cart,
        addToCart,
        removeFromCart,
        filterMenu,
        showNotification
    };
    console.log('🔧 Modo desarrollo: funciones disponibles en window.restaurantApp');
}