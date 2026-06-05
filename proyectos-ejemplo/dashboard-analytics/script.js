// Dashboard Analytics - JavaScript

// Configuración global
const config = {
    animationDuration: 300,
    chartColors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4'
    },
    gradients: {
        primary: ['#3b82f6', '#2563eb'],
        success: ['#10b981', '#059669'],
        warning: ['#f59e0b', '#d97706'],
        danger: ['#ef4444', '#dc2626']
    }
};

// Estado global de la aplicación
const appState = {
    currentSection: 'dashboard',
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    dateRange: '7d',
    charts: {},
    data: {
        kpis: {
            totalUsers: { value: 12847, change: 12.5, trend: 'up' },
            revenue: { value: 89432, change: -2.3, trend: 'down' },
            orders: { value: 1247, change: 8.7, trend: 'up' },
            conversion: { value: 3.24, change: 0.8, trend: 'up' }
        },
        recentActivity: [
            { type: 'user', title: 'Nuevo usuario registrado', time: 'Hace 2 min', icon: 'fas fa-user-plus' },
            { type: 'order', title: 'Pedido completado #1247', time: 'Hace 5 min', icon: 'fas fa-shopping-cart' },
            { type: 'payment', title: 'Pago recibido $299', time: 'Hace 8 min', icon: 'fas fa-credit-card' },
            { type: 'user', title: 'Usuario premium activado', time: 'Hace 12 min', icon: 'fas fa-crown' },
            { type: 'system', title: 'Backup completado', time: 'Hace 15 min', icon: 'fas fa-database' }
        ],
        quickStats: {
            'Sesiones activas': 1247,
            'Páginas vistas': 8934,
            'Tiempo promedio': '4:32',
            'Tasa de rebote': '32.4%'
        }
    }
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    initializeCharts();
    updateKPIs();
    updateRecentActivity();
    updateQuickStats();
    showSection('dashboard');
    
    // Simular actualizaciones en tiempo real
    setInterval(updateRealTimeData, 30000); // Cada 30 segundos
    
    console.log('Dashboard Analytics inicializado correctamente');
}

// Event Listeners
function setupEventListeners() {
    // Sidebar toggle
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Date range picker
    const dateRangePicker = document.querySelector('#dateRange');
    if (dateRangePicker) {
        dateRangePicker.addEventListener('change', handleDateRangeChange);
    }
    
    // Modal controls
    setupModalControls();
    
    // Form submissions
    setupFormHandlers();
    
    // Responsive handlers
    window.addEventListener('resize', handleResize);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Sidebar functionality
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    appState.sidebarCollapsed = !appState.sidebarCollapsed;
    
    if (appState.sidebarCollapsed) {
        sidebar.classList.add('collapsed');
    } else {
        sidebar.classList.remove('collapsed');
    }
    
    // Redimensionar gráficos después del cambio
    setTimeout(() => {
        Object.values(appState.charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }, config.animationDuration);
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    appState.mobileMenuOpen = !appState.mobileMenuOpen;
    
    if (appState.mobileMenuOpen) {
        sidebar.classList.add('active');
    } else {
        sidebar.classList.remove('active');
    }
}

// Navigation
function handleNavigation(e) {
    e.preventDefault();
    
    const sectionId = e.currentTarget.getAttribute('data-section');
    if (sectionId) {
        showSection(sectionId);
        updateActiveNavItem(e.currentTarget);
        
        // Cerrar menú móvil si está abierto
        if (appState.mobileMenuOpen) {
            toggleMobileMenu();
        }
    }
}

function showSection(sectionId) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
        
        // Actualizar título de la página
        updatePageTitle(sectionId);
        
        // Inicializar contenido específico de la sección
        initializeSectionContent(sectionId);
    }
    
    appState.currentSection = sectionId;
}

function updateActiveNavItem(activeLink) {
    // Remover clase active de todos los nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Agregar clase active al item seleccionado
    const parentNavItem = activeLink.closest('.nav-item');
    if (parentNavItem) {
        parentNavItem.classList.add('active');
    }
}

function updatePageTitle(sectionId) {
    const titles = {
        'dashboard': 'Dashboard',
        'analytics': 'Analytics Detallado',
        'reports': 'Reportes',
        'users': 'Gestión de Usuarios',
        'settings': 'Configuración'
    };
    
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && titles[sectionId]) {
        pageTitle.textContent = titles[sectionId];
    }
}

// Inicialización de contenido por sección
function initializeSectionContent(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateKPIs();
            updateCharts();
            break;
        case 'analytics':
            initializeAnalyticsCharts();
            break;
        case 'reports':
            loadReports();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// KPIs
function updateKPIs() {
    const kpiData = appState.data.kpis;
    
    // Total Users
    updateKPICard('totalUsers', {
        value: formatNumber(kpiData.totalUsers.value),
        change: kpiData.totalUsers.change,
        trend: kpiData.totalUsers.trend
    });
    
    // Revenue
    updateKPICard('revenue', {
        value: formatCurrency(kpiData.revenue.value),
        change: kpiData.revenue.change,
        trend: kpiData.revenue.trend
    });
    
    // Orders
    updateKPICard('orders', {
        value: formatNumber(kpiData.orders.value),
        change: kpiData.orders.change,
        trend: kpiData.orders.trend
    });
    
    // Conversion
    updateKPICard('conversion', {
        value: kpiData.conversion.value + '%',
        change: kpiData.conversion.change,
        trend: kpiData.conversion.trend
    });
}

function updateKPICard(kpiId, data) {
    const card = document.querySelector(`[data-kpi="${kpiId}"]`);
    if (!card) return;
    
    const valueElement = card.querySelector('.kpi-value');
    const changeElement = card.querySelector('.kpi-change');
    
    if (valueElement) {
        valueElement.textContent = data.value;
    }
    
    if (changeElement) {
        const changeIcon = data.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
        const changeClass = data.trend === 'up' ? 'positive' : 'negative';
        const changeSign = data.change > 0 ? '+' : '';
        
        changeElement.innerHTML = `
            <i class="${changeIcon}"></i>
            ${changeSign}${data.change}%
        `;
        
        changeElement.className = `kpi-change ${changeClass}`;
    }
}

// Charts
function initializeCharts() {
    // Verificar que Chart.js esté disponible
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js no está disponible. Los gráficos no se mostrarán.');
        return;
    }
    
    // Configuración global de Chart.js
    Chart.defaults.font.family = 'Inter, sans-serif';
    Chart.defaults.color = '#6b7280';
    Chart.defaults.borderColor = '#e5e7eb';
    
    initializeRevenueChart();
    initializeUsersChart();
    initializeTrafficChart();
    initializeConversionChart();
}

function initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Ingresos',
            data: [65000, 72000, 68000, 85000, 92000, 88000, 95000],
            borderColor: config.chartColors.primary,
            backgroundColor: config.chartColors.primary + '20',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: config.chartColors.primary,
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        return 'Ingresos: ' + formatCurrency(context.parsed.y);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6'
                },
                ticks: {
                    callback: function(value) {
                        return formatCurrency(value);
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };
    
    appState.charts.revenue = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function initializeUsersChart() {
    const ctx = document.getElementById('usersChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Nuevos', 'Recurrentes', 'Premium', 'Inactivos'],
        datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: [
                config.chartColors.primary,
                config.chartColors.success,
                config.chartColors.warning,
                config.chartColors.secondary
            ],
            borderWidth: 0
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                    }
                }
            }
        }
    };
    
    appState.charts.users = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

function initializeTrafficChart() {
    const ctx = document.getElementById('trafficChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Visitas',
            data: [1200, 1900, 1500, 2100, 2400, 1800, 1300],
            backgroundColor: config.chartColors.info,
            borderRadius: 4
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff'
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };
    
    appState.charts.traffic = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

function initializeConversionChart() {
    const ctx = document.getElementById('conversionChart');
    if (!ctx) return;
    
    const data = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
            label: 'Conversión',
            data: [2.1, 2.8, 3.2, 2.9, 3.5, 3.8],
            borderColor: config.chartColors.success,
            backgroundColor: config.chartColors.success + '20',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                    label: function(context) {
                        return 'Conversión: ' + context.parsed.y + '%';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f3f4f6'
                },
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };
    
    appState.charts.conversion = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

function updateCharts() {
    // Simular actualización de datos de gráficos
    Object.values(appState.charts).forEach(chart => {
        if (chart && chart.update) {
            chart.update('none');
        }
    });
}

// Recent Activity
function updateRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    const activities = appState.data.recentActivity;
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

// Quick Stats
function updateQuickStats() {
    const statsList = document.querySelector('.stats-list');
    if (!statsList) return;
    
    const stats = appState.data.quickStats;
    
    statsList.innerHTML = Object.entries(stats).map(([label, value]) => `
        <div class="stat-item">
            <span class="stat-label">${label}</span>
            <span class="stat-value">${value}</span>
        </div>
    `).join('');
}

// Date Range Handler
function handleDateRangeChange(e) {
    appState.dateRange = e.target.value;
    
    // Mostrar loading
    showLoading();
    
    // Simular carga de datos
    setTimeout(() => {
        updateDashboardData();
        hideLoading();
        showNotification('Datos actualizados correctamente', 'success');
    }, 1000);
}

function updateDashboardData() {
    // Simular nuevos datos basados en el rango de fechas
    const multiplier = Math.random() * 0.3 + 0.85; // 0.85 - 1.15
    
    Object.keys(appState.data.kpis).forEach(key => {
        appState.data.kpis[key].value = Math.floor(appState.data.kpis[key].value * multiplier);
        appState.data.kpis[key].change = (Math.random() - 0.5) * 20; // -10% a +10%
        appState.data.kpis[key].trend = appState.data.kpis[key].change > 0 ? 'up' : 'down';
    });
    
    updateKPIs();
    updateCharts();
}

// Real-time updates
function updateRealTimeData() {
    // Simular actualizaciones en tiempo real
    const randomKPI = Object.keys(appState.data.kpis)[Math.floor(Math.random() * 4)];
    const change = (Math.random() - 0.5) * 10; // -5% a +5%
    
    appState.data.kpis[randomKPI].value += Math.floor(appState.data.kpis[randomKPI].value * change / 100);
    appState.data.kpis[randomKPI].change = change;
    appState.data.kpis[randomKPI].trend = change > 0 ? 'up' : 'down';
    
    updateKPIs();
    
    // Agregar nueva actividad
    const newActivity = {
        type: 'system',
        title: 'Datos actualizados automáticamente',
        time: 'Ahora',
        icon: 'fas fa-sync-alt'
    };
    
    appState.data.recentActivity.unshift(newActivity);
    appState.data.recentActivity = appState.data.recentActivity.slice(0, 5);
    
    updateRecentActivity();
}

// Analytics Section
function initializeAnalyticsCharts() {
    // Implementar gráficos adicionales para la sección de analytics
    console.log('Inicializando gráficos de analytics detallado');
}

// Reports Section
function loadReports() {
    console.log('Cargando reportes');
}

// Users Section
function loadUsersTable() {
    console.log('Cargando tabla de usuarios');
}

// Settings Section
function loadSettings() {
    console.log('Cargando configuración');
}

// Modal functionality
function setupModalControls() {
    // Close modal buttons
    const modalCloses = document.querySelectorAll('.modal-close, [data-modal-close]');
    modalCloses.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    // Close modal on backdrop click
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
        activeModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Form handlers
function setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Mostrar loading
    showLoading();
    
    // Simular envío
    setTimeout(() => {
        hideLoading();
        showNotification('Configuración guardada correctamente', 'success');
        
        // Cerrar modal si está en uno
        closeModal();
    }, 1500);
}

// Loading overlay
function showLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
}

// Notifications
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Agregar estilos si no existen
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                padding: 1rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                z-index: 9999;
                min-width: 300px;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                border-left: 4px solid #10b981;
            }
            .notification-error {
                border-left: 4px solid #ef4444;
            }
            .notification-warning {
                border-left: 4px solid #f59e0b;
            }
            .notification-info {
                border-left: 4px solid #3b82f6;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-close {
                background: none;
                border: none;
                color: #6b7280;
                cursor: pointer;
                padding: 0.25rem;
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Configurar cierre
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Responsive handlers
function handleResize() {
    // Redimensionar gráficos
    Object.values(appState.charts).forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
    
    // Cerrar menú móvil en pantallas grandes
    if (window.innerWidth > 768 && appState.mobileMenuOpen) {
        toggleMobileMenu();
    }
}

// Keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Esc para cerrar modales
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + K para buscar
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Implementar búsqueda
        console.log('Búsqueda activada');
    }
}

// Utility functions
function formatNumber(num) {
    return new Intl.NumberFormat('es-ES').format(num);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export para testing (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        appState,
        config,
        formatNumber,
        formatCurrency
    };
}