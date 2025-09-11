// Global Configuration
const CONFIG = {
    itemsPerPage: 9,
    animationDelay: 100,
    notificationDuration: 5000,
    searchDebounceDelay: 300
};

// Application State
const AppState = {
    currentPage: 1,
    currentFilters: {
        type: '',
        propertyType: '',
        location: '',
        price: '',
        bedrooms: '',
        sort: 'newest'
    },
    currentView: 'grid',
    searchType: 'venta',
    favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
    user: JSON.parse(localStorage.getItem('user') || 'null')
};

// Sample Properties Data
const PROPERTIES = [
    {
        id: 1,
        title: 'Moderno Apartamento en el Centro',
        type: 'venta',
        propertyType: 'apartamento',
        price: 285000,
        location: 'madrid',
        address: 'Calle Gran Vía 45, Madrid Centro',
        bedrooms: 2,
        bathrooms: 2,
        size: 85,
        features: ['Aire acondicionado', 'Balcón', 'Ascensor', 'Parking'],
        description: 'Hermoso apartamento completamente renovado en el corazón de Madrid. Cuenta con acabados de lujo, cocina moderna y una ubicación inmejorable cerca de todas las comodidades.',
        agent: {
            name: 'María González',
            title: 'Agente Senior',
            phone: '+34 91 123 45 67',
            email: 'maria@inmovision.es'
        },
        featured: true,
        dateAdded: '2024-01-15'
    },
    {
        id: 2,
        title: 'Villa de Lujo con Piscina',
        type: 'venta',
        propertyType: 'villa',
        price: 750000,
        location: 'madrid',
        address: 'Urbanización Las Rozas, Madrid',
        bedrooms: 4,
        bathrooms: 3,
        size: 250,
        features: ['Piscina', 'Jardín', 'Garaje', 'Chimenea', 'Terraza'],
        description: 'Espectacular villa independiente con piscina privada y amplios jardines. Perfecta para familias que buscan tranquilidad sin renunciar a la proximidad a la ciudad.',
        agent: {
            name: 'Carlos Ruiz',
            title: 'Director Comercial',
            phone: '+34 91 234 56 78',
            email: 'carlos@inmovision.es'
        },
        featured: true,
        dateAdded: '2024-01-10'
    },
    {
        id: 3,
        title: 'Estudio Moderno para Estudiantes',
        type: 'alquiler',
        propertyType: 'estudio',
        price: 850,
        location: 'madrid',
        address: 'Calle Fuencarral 123, Madrid',
        bedrooms: 1,
        bathrooms: 1,
        size: 35,
        features: ['Amueblado', 'Internet', 'Calefacción', 'Cerca metro'],
        description: 'Estudio completamente amueblado ideal para estudiantes o jóvenes profesionales. Ubicado en zona universitaria con excelentes conexiones de transporte.',
        agent: {
            name: 'Ana Martín',
            title: 'Especialista en Alquileres',
            phone: '+34 91 345 67 89',
            email: 'ana@inmovision.es'
        },
        featured: false,
        dateAdded: '2024-01-20'
    },
    {
        id: 4,
        title: 'Casa Familiar en Barcelona',
        type: 'venta',
        propertyType: 'casa',
        price: 420000,
        location: 'barcelona',
        address: 'Barrio de Gràcia, Barcelona',
        bedrooms: 3,
        bathrooms: 2,
        size: 120,
        features: ['Terraza', 'Trastero', 'Cerca colegios', 'Zona verde'],
        description: 'Encantadora casa familiar en el corazón de Gràcia. Perfecta para familias, con espacios amplios y una terraza ideal para disfrutar del buen tiempo.',
        agent: {
            name: 'Jordi Puig',
            title: 'Agente Barcelona',
            phone: '+34 93 123 45 67',
            email: 'jordi@inmovision.es'
        },
        featured: true,
        dateAdded: '2024-01-12'
    },
    {
        id: 5,
        title: 'Penthouse con Vistas al Mar',
        type: 'venta',
        propertyType: 'penthouse',
        price: 890000,
        location: 'valencia',
        address: 'Paseo Marítimo, Valencia',
        bedrooms: 3,
        bathrooms: 3,
        size: 180,
        features: ['Vistas al mar', 'Terraza 50m²', 'Parking', 'Piscina comunitaria'],
        description: 'Exclusivo penthouse con impresionantes vistas al Mediterráneo. Acabados de primera calidad y una terraza espectacular para disfrutar de las puestas de sol.',
        agent: {
            name: 'Carmen López',
            title: 'Especialista Propiedades Exclusivas',
            phone: '+34 96 123 45 67',
            email: 'carmen@inmovision.es'
        },
        featured: true,
        dateAdded: '2024-01-08'
    },
    {
        id: 6,
        title: 'Apartamento Céntrico en Sevilla',
        type: 'alquiler',
        propertyType: 'apartamento',
        price: 1200,
        location: 'sevilla',
        address: 'Calle Sierpes, Sevilla Centro',
        bedrooms: 2,
        bathrooms: 1,
        size: 75,
        features: ['Centro histórico', 'Aire acondicionado', 'Balcón', 'Amueblado'],
        description: 'Precioso apartamento en pleno centro histórico de Sevilla. Completamente renovado y amueblado, perfecto para disfrutar de la ciudad.',
        agent: {
            name: 'Rafael Moreno',
            title: 'Agente Sevilla',
            phone: '+34 95 123 45 67',
            email: 'rafael@inmovision.es'
        },
        featured: false,
        dateAdded: '2024-01-18'
    },
    {
        id: 7,
        title: 'Casa con Jardín en Bilbao',
        type: 'venta',
        propertyType: 'casa',
        price: 380000,
        location: 'bilbao',
        address: 'Barrio de Deusto, Bilbao',
        bedrooms: 4,
        bathrooms: 2,
        size: 140,
        features: ['Jardín privado', 'Garaje', 'Trastero', 'Cerca metro'],
        description: 'Amplia casa familiar con jardín privado en una zona tranquila de Bilbao. Ideal para familias que buscan espacio y comodidad.',
        agent: {
            name: 'Iker Etxebarria',
            title: 'Agente Bilbao',
            phone: '+34 94 123 45 67',
            email: 'iker@inmovision.es'
        },
        featured: false,
        dateAdded: '2024-01-14'
    },
    {
        id: 8,
        title: 'Loft Industrial Renovado',
        type: 'alquiler',
        propertyType: 'apartamento',
        price: 1800,
        location: 'barcelona',
        address: 'Barrio del Poblenou, Barcelona',
        bedrooms: 2,
        bathrooms: 2,
        size: 95,
        features: ['Estilo loft', 'Techos altos', 'Terraza', 'Zona trendy'],
        description: 'Espectacular loft industrial completamente renovado en el moderno barrio del Poblenou. Espacios diáfanos y diseño contemporáneo.',
        agent: {
            name: 'Marta Soler',
            title: 'Especialista Propiedades Únicas',
            phone: '+34 93 234 56 78',
            email: 'marta@inmovision.es'
        },
        featured: false,
        dateAdded: '2024-01-16'
    },
    {
        id: 9,
        title: 'Apartamento Nuevo con Parking',
        type: 'venta',
        propertyType: 'apartamento',
        price: 195000,
        location: 'valencia',
        address: 'Nuevo desarrollo, Valencia',
        bedrooms: 2,
        bathrooms: 2,
        size: 70,
        features: ['Obra nueva', 'Parking incluido', 'Trastero', 'Piscina'],
        description: 'Apartamento de obra nueva en moderno complejo residencial. Incluye plaza de parking y trastero. Entrega inmediata.',
        agent: {
            name: 'Vicente Sánchez',
            title: 'Especialista Obra Nueva',
            phone: '+34 96 234 56 78',
            email: 'vicente@inmovision.es'
        },
        featured: false,
        dateAdded: '2024-01-22'
    },
    {
        id: 10,
        title: 'Casa Rural con Finca',
        type: 'venta',
        propertyType: 'casa',
        price: 320000,
        location: 'sevilla',
        address: 'Alrededores de Sevilla',
        bedrooms: 3,
        bathrooms: 2,
        size: 160,
        features: ['Finca 2000m²', 'Piscina', 'Barbacoa', 'Tranquilidad'],
        description: 'Hermosa casa rural con amplia finca. Perfecta para desconectar de la ciudad manteniendo fácil acceso a Sevilla.',
        agent: {
            name: 'Isabel Romero',
            title: 'Especialista Propiedades Rurales',
            phone: '+34 95 234 56 78',
            email: 'isabel@inmovision.es'
        },
        featured: false,
        dateAdded: '2024-01-11'
    }
];

// Utility Functions
const Utils = {
    formatPrice: (price, type) => {
        const formatter = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        const formattedPrice = formatter.format(price);
        return type === 'alquiler' ? `${formattedPrice}/mes` : formattedPrice;
    },
    
    formatSize: (size) => `${size} m²`,
    
    formatLocation: (location) => {
        const locations = {
            madrid: 'Madrid',
            barcelona: 'Barcelona',
            valencia: 'Valencia',
            sevilla: 'Sevilla',
            bilbao: 'Bilbao'
        };
        return locations[location] || location;
    },
    
    formatPropertyType: (type) => {
        const types = {
            apartamento: 'Apartamento',
            casa: 'Casa',
            villa: 'Villa',
            penthouse: 'Penthouse',
            estudio: 'Estudio'
        };
        return types[type] || type;
    },
    
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    generateId: () => Math.random().toString(36).substr(2, 9),
    
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    validatePhone: (phone) => {
        const re = /^[+]?[0-9\s-()]{9,}$/;
        return re.test(phone);
    },
    
    scrollToElement: (element, offset = 100) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
};

// Local Storage Manager
const StorageManager = {
    save: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },
    
    load: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return defaultValue;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }
};

// Notification Manager
const NotificationManager = {
    show: (message, type = 'info', title = '') => {
        const container = document.querySelector('.notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            success: 'fas fa-check',
            error: 'fas fa-times',
            warning: 'fas fa-exclamation',
            info: 'fas fa-info'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icons[type] || icons.info}"></i>
            </div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, CONFIG.notificationDuration);
        
        container.appendChild(notification);
    }
};

// Loading Manager
const LoadingManager = {
    show: () => {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    },
    
    hide: () => {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }
};

// Modal Manager
const ModalManager = {
    open: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Focus first input if exists
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },
    
    close: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    closeAll: () => {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
};

// Property Manager
const PropertyManager = {
    getAll: () => PROPERTIES,
    
    getById: (id) => PROPERTIES.find(property => property.id === parseInt(id)),
    
    getFeatured: () => PROPERTIES.filter(property => property.featured),
    
    filter: (filters) => {
        return PROPERTIES.filter(property => {
            // Type filter (venta/alquiler)
            if (filters.type && property.type !== filters.type) {
                return false;
            }
            
            // Property type filter
            if (filters.propertyType && property.propertyType !== filters.propertyType) {
                return false;
            }
            
            // Location filter
            if (filters.location && property.location !== filters.location) {
                return false;
            }
            
            // Price filter
            if (filters.price) {
                const [min, max] = filters.price.split('-').map(p => parseInt(p));
                if (max) {
                    if (property.price < min || property.price > max) {
                        return false;
                    }
                } else if (filters.price.includes('+')) {
                    if (property.price < min) {
                        return false;
                    }
                }
            }
            
            // Bedrooms filter
            if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) {
                return false;
            }
            
            return true;
        });
    },
    
    sort: (properties, sortBy) => {
        const sorted = [...properties];
        
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'size-large':
                return sorted.sort((a, b) => b.size - a.size);
            case 'size-small':
                return sorted.sort((a, b) => a.size - b.size);
            case 'newest':
            default:
                return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        }
    },
    
    search: (properties, query) => {
        if (!query) return properties;
        
        const searchTerm = query.toLowerCase();
        return properties.filter(property => {
            return (
                property.title.toLowerCase().includes(searchTerm) ||
                property.address.toLowerCase().includes(searchTerm) ||
                property.description.toLowerCase().includes(searchTerm) ||
                Utils.formatLocation(property.location).toLowerCase().includes(searchTerm) ||
                Utils.formatPropertyType(property.propertyType).toLowerCase().includes(searchTerm)
            );
        });
    }
};

// Favorites Manager
const FavoritesManager = {
    add: (propertyId) => {
        if (!AppState.favorites.includes(propertyId)) {
            AppState.favorites.push(propertyId);
            StorageManager.save('favorites', AppState.favorites);
            NotificationManager.show('Propiedad añadida a favoritos', 'success');
        }
    },
    
    remove: (propertyId) => {
        AppState.favorites = AppState.favorites.filter(id => id !== propertyId);
        StorageManager.save('favorites', AppState.favorites);
        NotificationManager.show('Propiedad eliminada de favoritos', 'info');
    },
    
    toggle: (propertyId) => {
        if (AppState.favorites.includes(propertyId)) {
            FavoritesManager.remove(propertyId);
        } else {
            FavoritesManager.add(propertyId);
        }
        
        // Update UI
        const favoriteBtn = document.querySelector(`[data-property-id="${propertyId}"] .property-favorite`);
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('active', AppState.favorites.includes(propertyId));
        }
    },
    
    isFavorite: (propertyId) => AppState.favorites.includes(propertyId)
};

// UI Renderers
const UIRenderer = {
    renderPropertyCard: (property, isListView = false) => {
        const isFavorite = FavoritesManager.isFavorite(property.id);
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-image">
                    <i class="fas fa-home"></i>
                    <div class="property-badge ${property.type}">${property.type === 'venta' ? 'Venta' : 'Alquiler'}</div>
                    <button class="property-favorite ${isFavorite ? 'active' : ''}" data-property-id="${property.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="property-content">
                    <div class="property-price">${Utils.formatPrice(property.price, property.type)}</div>
                    <h3 class="property-title">${property.title}</h3>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.address}
                    </div>
                    <div class="property-features">
                        <div class="property-feature">
                            <i class="fas fa-bed"></i>
                            ${property.bedrooms} hab.
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-bath"></i>
                            ${property.bathrooms} baños
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-ruler-combined"></i>
                            ${Utils.formatSize(property.size)}
                        </div>
                    </div>
                    <div class="property-actions">
                        <button class="btn btn-outline property-details-btn" data-property-id="${property.id}">
                            <i class="fas fa-eye"></i>
                            Ver detalles
                        </button>
                        <button class="btn btn-primary property-contact-btn" data-property-id="${property.id}">
                            <i class="fas fa-phone"></i>
                            Contactar
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    renderFeaturedProperties: () => {
        const container = document.getElementById('featured-properties');
        if (!container) return;
        
        const featuredProperties = PropertyManager.getFeatured();
        
        if (featuredProperties.length === 0) {
            container.innerHTML = '<p class="no-results">No hay propiedades destacadas disponibles.</p>';
            return;
        }
        
        container.innerHTML = featuredProperties
            .map(property => UIRenderer.renderPropertyCard(property))
            .join('');
        
        // Add event listeners
        UIRenderer.attachPropertyEventListeners(container);
    },
    
    renderAllProperties: () => {
        const container = document.getElementById('all-properties');
        if (!container) return;
        
        LoadingManager.show();
        
        // Simulate loading delay
        setTimeout(() => {
            let filteredProperties = PropertyManager.filter(AppState.currentFilters);
            filteredProperties = PropertyManager.sort(filteredProperties, AppState.currentFilters.sort);
            
            const totalProperties = filteredProperties.length;
            const startIndex = (AppState.currentPage - 1) * CONFIG.itemsPerPage;
            const endIndex = startIndex + CONFIG.itemsPerPage;
            const paginatedProperties = filteredProperties.slice(startIndex, endIndex);
            
            if (paginatedProperties.length === 0) {
                container.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search"></i>
                        <h3>No se encontraron propiedades</h3>
                        <p>Intenta ajustar los filtros de búsqueda para encontrar más resultados.</p>
                        <button class="btn btn-primary" id="clear-filters-btn">
                            <i class="fas fa-times"></i>
                            Limpiar filtros
                        </button>
                    </div>
                `;
                
                // Add clear filters event
                const clearBtn = container.querySelector('#clear-filters-btn');
                if (clearBtn) {
                    clearBtn.addEventListener('click', FilterManager.clearAll);
                }
            } else {
                const isListView = AppState.currentView === 'list';
                container.className = `properties-grid ${isListView ? 'list-view' : ''}`;
                
                container.innerHTML = paginatedProperties
                    .map(property => UIRenderer.renderPropertyCard(property, isListView))
                    .join('');
                
                // Add event listeners
                UIRenderer.attachPropertyEventListeners(container);
            }
            
            // Render pagination
            UIRenderer.renderPagination(totalProperties);
            
            LoadingManager.hide();
        }, 500);
    },
    
    renderPagination: (totalItems) => {
        const container = document.getElementById('pagination');
        if (!container) return;
        
        const totalPages = Math.ceil(totalItems / CONFIG.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }
        
        let paginationHTML = '';
        
        // Previous button
        paginationHTML += `
            <button class="pagination-btn" data-page="${AppState.currentPage - 1}" ${AppState.currentPage === 1 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i>
            </button>
        `;
        
        // Page numbers
        const startPage = Math.max(1, AppState.currentPage - 2);
        const endPage = Math.min(totalPages, AppState.currentPage + 2);
        
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="pagination-btn ${i === AppState.currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-ellipsis">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // Next button
        paginationHTML += `
            <button class="pagination-btn" data-page="${AppState.currentPage + 1}" ${AppState.currentPage === totalPages ? 'disabled' : ''}>
                <i class="fas fa-chevron-right"></i>
            </button>
        `;
        
        container.innerHTML = paginationHTML;
        
        // Add event listeners
        container.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                if (page && page !== AppState.currentPage) {
                    AppState.currentPage = page;
                    UIRenderer.renderAllProperties();
                    
                    // Scroll to properties section
                    const propertiesSection = document.getElementById('propiedades');
                    if (propertiesSection) {
                        Utils.scrollToElement(propertiesSection);
                    }
                }
            });
        });
    },
    
    attachPropertyEventListeners: (container) => {
        // Favorite buttons
        container.querySelectorAll('.property-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = parseInt(btn.dataset.propertyId);
                FavoritesManager.toggle(propertyId);
            });
        });
        
        // Details buttons
        container.querySelectorAll('.property-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = parseInt(btn.dataset.propertyId);
                PropertyDetailsModal.open(propertyId);
            });
        });
        
        // Contact buttons
        container.querySelectorAll('.property-contact-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const propertyId = parseInt(btn.dataset.propertyId);
                ContactPropertyModal.open(propertyId);
            });
        });
        
        // Property card click
        container.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const propertyId = parseInt(card.dataset.propertyId);
                    PropertyDetailsModal.open(propertyId);
                }
            });
        });
    }
};

// Filter Manager
const FilterManager = {
    init: () => {
        // Search form filters
        const searchForm = document.querySelector('.search-filters');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                FilterManager.applySearchFilters();
            });
        }
        
        // Properties page filters
        const filterSelects = document.querySelectorAll('.properties-filters select');
        filterSelects.forEach(select => {
            select.addEventListener('change', FilterManager.applyFilters);
        });
        
        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', FilterManager.clearAll);
        }
        
        // View toggle
        const viewBtns = document.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                FilterManager.setView(view);
            });
        });
        
        // Search tabs
        const searchTabs = document.querySelectorAll('.search-tab');
        searchTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                FilterManager.setSearchType(type);
            });
        });
    },
    
    applySearchFilters: () => {
        const form = document.querySelector('.search-filters');
        if (!form) return;
        
        AppState.currentFilters = {
            type: AppState.searchType,
            propertyType: form.querySelector('#property-type').value,
            location: '', // Location search is text-based, would need geocoding
            price: form.querySelector('#price-range').value,
            bedrooms: form.querySelector('#bedrooms').value,
            sort: 'newest'
        };
        
        AppState.currentPage = 1;
        
        // Navigate to properties section
        const propertiesSection = document.getElementById('propiedades');
        if (propertiesSection) {
            Utils.scrollToElement(propertiesSection);
        }
        
        // Update properties filters to match
        FilterManager.updateFiltersUI();
        UIRenderer.renderAllProperties();
        
        NotificationManager.show('Filtros aplicados correctamente', 'success');
    },
    
    applyFilters: () => {
        const filterForm = document.querySelector('.properties-filters');
        if (!filterForm) return;
        
        AppState.currentFilters = {
            type: filterForm.querySelector('#filter-type').value,
            propertyType: filterForm.querySelector('#filter-property-type').value,
            location: filterForm.querySelector('#filter-location').value,
            price: filterForm.querySelector('#filter-price').value,
            bedrooms: filterForm.querySelector('#filter-bedrooms').value,
            sort: filterForm.querySelector('#sort-by').value
        };
        
        AppState.currentPage = 1;
        UIRenderer.renderAllProperties();
    },
    
    clearAll: () => {
        AppState.currentFilters = {
            type: '',
            propertyType: '',
            location: '',
            price: '',
            bedrooms: '',
            sort: 'newest'
        };
        
        AppState.currentPage = 1;
        
        // Reset form values
        const filterForm = document.querySelector('.properties-filters');
        if (filterForm) {
            filterForm.querySelectorAll('select').forEach(select => {
                select.value = '';
            });
            filterForm.querySelector('#sort-by').value = 'newest';
        }
        
        UIRenderer.renderAllProperties();
        NotificationManager.show('Filtros eliminados', 'info');
    },
    
    setView: (view) => {
        AppState.currentView = view;
        
        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        UIRenderer.renderAllProperties();
    },
    
    setSearchType: (type) => {
        AppState.searchType = type;
        
        // Update search tabs
        document.querySelectorAll('.search-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.type === type);
        });
    },
    
    updateFiltersUI: () => {
        const filterForm = document.querySelector('.properties-filters');
        if (!filterForm) return;
        
        filterForm.querySelector('#filter-type').value = AppState.currentFilters.type;
        filterForm.querySelector('#filter-property-type').value = AppState.currentFilters.propertyType;
        filterForm.querySelector('#filter-location').value = AppState.currentFilters.location;
        filterForm.querySelector('#filter-price').value = AppState.currentFilters.price;
        filterForm.querySelector('#filter-bedrooms').value = AppState.currentFilters.bedrooms;
        filterForm.querySelector('#sort-by').value = AppState.currentFilters.sort;
    }
};

// Property Details Modal
const PropertyDetailsModal = {
    open: (propertyId) => {
        const property = PropertyManager.getById(propertyId);
        if (!property) return;
        
        const modal = document.getElementById('property-modal');
        const title = document.getElementById('property-modal-title');
        const body = document.getElementById('property-modal-body');
        
        if (!modal || !title || !body) return;
        
        title.textContent = property.title;
        
        body.innerHTML = `
            <div class="property-gallery">
                <div class="main-image">
                    <i class="fas fa-home"></i>
                </div>
                <div class="thumbnail-images">
                    <div class="thumbnail"><i class="fas fa-image"></i></div>
                    <div class="thumbnail"><i class="fas fa-image"></i></div>
                    <div class="thumbnail"><i class="fas fa-image"></i></div>
                </div>
            </div>
            
            <div class="property-details-grid">
                <div class="property-info">
                    <div class="property-price">${Utils.formatPrice(property.price, property.type)}</div>
                    <div class="property-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${property.address}
                    </div>
                    
                    <h4>Descripción</h4>
                    <p class="property-description">${property.description}</p>
                    
                    <h4>Características</h4>
                    <div class="property-features-list">
                        <div class="property-feature">
                            <i class="fas fa-bed"></i>
                            <div>
                                <strong>${property.bedrooms}</strong>
                                <span>Habitaciones</span>
                            </div>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-bath"></i>
                            <div>
                                <strong>${property.bathrooms}</strong>
                                <span>Baños</span>
                            </div>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-ruler-combined"></i>
                            <div>
                                <strong>${property.size}</strong>
                                <span>m² construidos</span>
                            </div>
                        </div>
                        <div class="property-feature">
                            <i class="fas fa-home"></i>
                            <div>
                                <strong>${Utils.formatPropertyType(property.propertyType)}</strong>
                                <span>Tipo</span>
                            </div>
                        </div>
                    </div>
                    
                    <h4>Extras incluidos</h4>
                    <ul class="property-extras">
                        ${property.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="property-sidebar">
                    <div class="agent-info">
                        <div class="agent-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="agent-name">${property.agent.name}</div>
                        <div class="agent-title">${property.agent.title}</div>
                        
                        <div class="agent-contact">
                            <a href="tel:${property.agent.phone}" class="btn btn-outline">
                                <i class="fas fa-phone"></i>
                                ${property.agent.phone}
                            </a>
                            <a href="mailto:${property.agent.email}" class="btn btn-outline">
                                <i class="fas fa-envelope"></i>
                                Enviar email
                            </a>
                            <button class="btn btn-primary property-contact-modal-btn" data-property-id="${property.id}">
                                <i class="fas fa-comment"></i>
                                Solicitar información
                            </button>
                        </div>
                    </div>
                    
                    <div class="property-actions">
                        <button class="btn btn-outline property-favorite-modal-btn ${FavoritesManager.isFavorite(property.id) ? 'active' : ''}" data-property-id="${property.id}">
                            <i class="fas fa-heart"></i>
                            ${FavoritesManager.isFavorite(property.id) ? 'En favoritos' : 'Añadir a favoritos'}
                        </button>
                        <button class="btn btn-outline">
                            <i class="fas fa-share"></i>
                            Compartir
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        const contactBtn = body.querySelector('.property-contact-modal-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', () => {
                ModalManager.close('property-modal');
                ContactPropertyModal.open(property.id);
            });
        }
        
        const favoriteBtn = body.querySelector('.property-favorite-modal-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', () => {
                FavoritesManager.toggle(property.id);
                const isFavorite = FavoritesManager.isFavorite(property.id);
                favoriteBtn.classList.toggle('active', isFavorite);
                favoriteBtn.innerHTML = `
                    <i class="fas fa-heart"></i>
                    ${isFavorite ? 'En favoritos' : 'Añadir a favoritos'}
                `;
            });
        }
        
        ModalManager.open('property-modal');
    }
};

// Contact Property Modal
const ContactPropertyModal = {
    open: (propertyId) => {
        const property = PropertyManager.getById(propertyId);
        if (!property) return;
        
        const propertyIdInput = document.getElementById('property-id');
        const messageTextarea = document.getElementById('contact-prop-message');
        
        if (propertyIdInput) {
            propertyIdInput.value = propertyId;
        }
        
        if (messageTextarea) {
            messageTextarea.value = `Hola, estoy interesado/a en la propiedad "${property.title}" ubicada en ${property.address}. Me gustaría recibir más información. Gracias.`;
        }
        
        ModalManager.open('contact-property-modal');
    }
};

// Form Handlers
const FormHandlers = {
    init: () => {
        // Contact form
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', FormHandlers.handleContactForm);
        }
        
        // Contact property form
        const contactPropertyForm = document.getElementById('contact-property-form');
        if (contactPropertyForm) {
            contactPropertyForm.addEventListener('submit', FormHandlers.handleContactPropertyForm);
        }
        
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', FormHandlers.handleLoginForm);
        }
        
        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', FormHandlers.handleRegisterForm);
        }
    },
    
    handleContactForm: (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.name || !data.email || !data.subject || !data.message) {
            NotificationManager.show('Por favor, completa todos los campos obligatorios', 'error');
            return;
        }
        
        if (!Utils.validateEmail(data.email)) {
            NotificationManager.show('Por favor, introduce un email válido', 'error');
            return;
        }
        
        if (!data.privacy) {
            NotificationManager.show('Debes aceptar la política de privacidad', 'error');
            return;
        }
        
        LoadingManager.show();
        
        // Simulate form submission
        setTimeout(() => {
            LoadingManager.hide();
            NotificationManager.show('Mensaje enviado correctamente. Te contactaremos pronto.', 'success', 'Mensaje enviado');
            e.target.reset();
        }, 2000);
    },
    
    handleContactPropertyForm: (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.name || !data.email || !data.message) {
            NotificationManager.show('Por favor, completa todos los campos obligatorios', 'error');
            return;
        }
        
        if (!Utils.validateEmail(data.email)) {
            NotificationManager.show('Por favor, introduce un email válido', 'error');
            return;
        }
        
        LoadingManager.show();
        
        // Simulate form submission
        setTimeout(() => {
            LoadingManager.hide();
            NotificationManager.show('Consulta enviada correctamente. El agente te contactará pronto.', 'success', 'Consulta enviada');
            ModalManager.close('contact-property-modal');
            e.target.reset();
        }, 2000);
    },
    
    handleLoginForm: (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (!data.email || !data.password) {
            NotificationManager.show('Por favor, completa todos los campos', 'error');
            return;
        }
        
        if (!Utils.validateEmail(data.email)) {
            NotificationManager.show('Por favor, introduce un email válido', 'error');
            return;
        }
        
        LoadingManager.show();
        
        // Simulate login
        setTimeout(() => {
            LoadingManager.hide();
            
            // Simulate successful login
            const user = {
                name: 'Usuario Demo',
                email: data.email,
                loginTime: new Date().toISOString()
            };
            
            AppState.user = user;
            StorageManager.save('user', user);
            
            NotificationManager.show(`¡Bienvenido/a, ${user.name}!`, 'success', 'Sesión iniciada');
            ModalManager.close('login-modal');
            e.target.reset();
            
            // Update UI
            UserManager.updateUI();
        }, 1500);
    },
    
    handleRegisterForm: (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validate required fields
        if (!data.name || !data.lastname || !data.email || !data.phone || !data.password || !data['confirm-password']) {
            NotificationManager.show('Por favor, completa todos los campos obligatorios', 'error');
            return;
        }
        
        if (!Utils.validateEmail(data.email)) {
            NotificationManager.show('Por favor, introduce un email válido', 'error');
            return;
        }
        
        if (!Utils.validatePhone(data.phone)) {
            NotificationManager.show('Por favor, introduce un teléfono válido', 'error');
            return;
        }
        
        if (data.password !== data['confirm-password']) {
            NotificationManager.show('Las contraseñas no coinciden', 'error');
            return;
        }
        
        if (data.password.length < 6) {
            NotificationManager.show('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        if (!data.terms) {
            NotificationManager.show('Debes aceptar los términos y condiciones', 'error');
            return;
        }
        
        LoadingManager.show();
        
        // Simulate registration
        setTimeout(() => {
            LoadingManager.hide();
            
            // Simulate successful registration
            const user = {
                name: `${data.name} ${data.lastname}`,
                email: data.email,
                phone: data.phone,
                registerTime: new Date().toISOString()
            };
            
            AppState.user = user;
            StorageManager.save('user', user);
            
            NotificationManager.show(`¡Cuenta creada exitosamente! Bienvenido/a, ${user.name}`, 'success', 'Registro completado');
            ModalManager.close('register-modal');
            e.target.reset();
            
            // Update UI
            UserManager.updateUI();
        }, 2000);
    }
};

// User Manager
const UserManager = {
    updateUI: () => {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;
        
        if (AppState.user) {
            headerActions.innerHTML = `
                <div class="user-menu">
                    <span class="user-greeting">Hola, ${AppState.user.name.split(' ')[0]}</span>
                    <button class="btn btn-outline" id="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        Cerrar Sesión
                    </button>
                </div>
                <button class="mobile-menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            `;
            
            // Add logout functionality
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', UserManager.logout);
            }
        } else {
            headerActions.innerHTML = `
                <button class="btn btn-outline" data-modal="login-modal">
                    <i class="fas fa-user"></i>
                    Iniciar Sesión
                </button>
                <button class="btn btn-primary" data-modal="register-modal">
                    <i class="fas fa-user-plus"></i>
                    Registrarse
                </button>
                <button class="mobile-menu-btn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            `;
        }
        
        // Re-attach modal event listeners
        App.attachModalEventListeners();
    },
    
    logout: () => {
        AppState.user = null;
        StorageManager.remove('user');
        NotificationManager.show('Sesión cerrada correctamente', 'info', 'Hasta pronto');
        UserManager.updateUI();
    }
};

// Main App Object
const App = {
    init: () => {
        console.log('🏠 InmoVision Portal Inmobiliario iniciado');
        
        // Load saved data
        AppState.favorites = StorageManager.load('favorites', []);
        AppState.user = StorageManager.load('user', null);
        
        // Initialize components
        App.attachEventListeners();
        App.attachModalEventListeners();
        App.initScrollEffects();
        App.initAnimations();
        
        // Initialize managers
        FilterManager.init();
        FormHandlers.init();
        
        // Render initial content
        UIRenderer.renderFeaturedProperties();
        UIRenderer.renderAllProperties();
        
        // Update user UI
        UserManager.updateUI();
        
        console.log('✅ Aplicación inicializada correctamente');
    },
    
    attachEventListeners: () => {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    Utils.scrollToElement(targetElement);
                }
            });
        });
        
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }
    },
    
    attachModalEventListeners: () => {
        // Modal triggers
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modal;
                ModalManager.open(modalId);
            });
        });
        
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                ModalManager.closeAll();
            });
        });
        
        // Modal backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    ModalManager.closeAll();
                }
            });
        });
        
        // Modal switching
        document.querySelectorAll('.modal a[data-modal]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                ModalManager.closeAll();
                setTimeout(() => {
                    const modalId = link.dataset.modal;
                    ModalManager.open(modalId);
                }, 100);
            });
        });
        
        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ModalManager.closeAll();
            }
        });
    },
    
    initScrollEffects: () => {
        const header = document.querySelector('.header');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        });
    },
    
    initAnimations: () => {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        document.querySelectorAll('.slide-in-left, .slide-in-right, .slide-up').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    }
};

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
} else {
    App.init();
}

// Export for debugging (optional)
if (typeof window !== 'undefined') {
    window.InmoVisionApp = {
        App,
        AppState,
        PropertyManager,
        FilterManager,
        FavoritesManager,
        NotificationManager,
        Utils
    };
}