// Script corregido para la plataforma educativa
console.log('=== CARGANDO SCRIPT CORREGIDO ===');

// Estado de la aplicación
const appState = {
    currentFilters: {
        category: '',
        level: '',
        price: '',
        sort: 'popular'
    },
    searchQuery: ''
};

// Datos de cursos simplificados
const coursesData = [
    {
        id: 1,
        title: 'Desarrollo Web Frontend con React',
        description: 'Aprende a crear aplicaciones web modernas con React, hooks y componentes reutilizables.',
        category: 'programacion',
        level: 'intermedio',
        price: 89.99,
        rating: 4.8,
        students: 1250,
        duration: '12 semanas',
        instructor: 'Ana García',
        image: 'fas fa-code',
        lessons: 45,
        certificate: true,
        featured: true
    },
    {
        id: 2,
        title: 'Diseño UX/UI Profesional',
        description: 'Domina los principios del diseño de experiencia de usuario y interfaces atractivas.',
        category: 'diseno',
        level: 'principiante',
        price: 0,
        rating: 4.6,
        students: 890,
        duration: '8 semanas',
        instructor: 'Carlos Ruiz',
        image: 'fas fa-palette',
        lessons: 32,
        certificate: true,
        featured: true
    },
    {
        id: 3,
        title: 'Marketing Digital Avanzado',
        description: 'Estrategias completas de marketing digital, SEO, SEM y redes sociales.',
        category: 'marketing',
        level: 'avanzado',
        price: 129.99,
        rating: 4.9,
        students: 2100,
        duration: '16 semanas',
        instructor: 'María López',
        image: 'fas fa-bullhorn',
        lessons: 58,
        certificate: true,
        featured: true
    },
    {
        id: 4,
        title: 'Análisis de Datos con Python',
        description: 'Aprende análisis de datos, visualización y machine learning con Python.',
        category: 'datos',
        level: 'intermedio',
        price: 99.99,
        rating: 4.7,
        students: 1580,
        duration: '14 semanas',
        instructor: 'David Chen',
        image: 'fas fa-chart-line',
        lessons: 52,
        certificate: true,
        featured: false
    },
    {
        id: 5,
        title: 'Fotografía Digital Creativa',
        description: 'Técnicas avanzadas de fotografía digital y edición profesional.',
        category: 'diseno',
        level: 'principiante',
        price: 69.99,
        rating: 4.5,
        students: 750,
        duration: '10 semanas',
        instructor: 'Laura Martín',
        image: 'fas fa-camera',
        lessons: 38,
        certificate: false,
        featured: false
    }
];

// Función para crear tarjeta de curso
function createCourseCard(course) {
    return `
        <div class="course-card" data-course-id="${course.id}">
            <div class="course-image">
                <i class="${course.image}"></i>
            </div>
            <div class="course-content">
                <div class="course-meta">
                    <span class="course-level ${course.level}">${course.level}</span>
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-users"></i> ${course.students}</span>
                </div>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-instructor">
                    <div class="instructor-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span class="instructor-name">Por ${course.instructor}</span>
                </div>
                <div class="course-footer">
                    <div class="course-rating">
                        <div class="stars">
                            ${generateStars(course.rating)}
                        </div>
                        <span>${course.rating}</span>
                    </div>
                    <div class="course-price ${course.price === 0 ? 'free' : ''}">
                        ${course.price === 0 ? 'Gratis' : `€${course.price}`}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para generar estrellas
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Función para renderizar cursos destacados
function renderFeaturedCourses() {
    console.log('=== RENDERIZANDO CURSOS DESTACADOS ===');
    
    const container = document.getElementById('featuredCourses');
    console.log('Contenedor encontrado:', container);
    
    if (!container) {
        console.error('No se encontró el contenedor de cursos destacados');
        return;
    }
    
    const featuredCourses = coursesData.filter(course => course.featured);
    console.log('Cursos destacados encontrados:', featuredCourses.length);
    
    if (featuredCourses.length === 0) {
        container.innerHTML = `
            <div class="no-courses">
                <i class="fas fa-book-open"></i>
                <h3>No hay cursos destacados disponibles</h3>
                <p>Pronto agregaremos nuevos cursos destacados.</p>
            </div>
        `;
        return;
    }
    
    const html = featuredCourses.map(course => createCourseCard(course)).join('');
    container.innerHTML = html;
    
    console.log('Cursos destacados renderizados correctamente');
}

// Función para renderizar todos los cursos
function renderAllCourses() {
    console.log('=== RENDERIZANDO TODOS LOS CURSOS ===');
    
    const container = document.getElementById('allCourses');
    console.log('Contenedor encontrado:', container);
    
    if (!container) {
        console.error('No se encontró el contenedor de todos los cursos');
        return;
    }
    
    // Aplicar filtros y búsqueda
    let filteredCourses = filterCourses(coursesData);
    
    console.log('Cursos filtrados:', filteredCourses.length);
    
    if (filteredCourses.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron cursos</h3>
                <p>Intenta ajustar los filtros o buscar con otros términos.</p>
                <button class="btn btn-primary" onclick="clearFilters()">
                    <i class="fas fa-refresh"></i>
                    Limpiar filtros
                </button>
            </div>
        `;
        return;
    }
    
    const html = filteredCourses.map(course => createCourseCard(course)).join('');
    container.innerHTML = html;
    
    // Agregar event listeners a las tarjetas
    addCourseCardListeners(container);
    
    console.log('Todos los cursos renderizados correctamente');
}

// Función para filtrar cursos
function filterCourses(courses) {
    let filtered = [...courses];
    
    // Filtrar por búsqueda
    if (appState.searchQuery) {
        const query = appState.searchQuery.toLowerCase();
        filtered = filtered.filter(course => 
            course.title.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query) ||
            course.instructor.toLowerCase().includes(query)
        );
    }
    
    // Filtrar por categoría
    if (appState.currentFilters.category) {
        filtered = filtered.filter(course => 
            course.category === appState.currentFilters.category
        );
    }
    
    // Filtrar por nivel
    if (appState.currentFilters.level) {
        filtered = filtered.filter(course => 
            course.level === appState.currentFilters.level
        );
    }
    
    // Filtrar por precio
    if (appState.currentFilters.price) {
        if (appState.currentFilters.price === 'free') {
            filtered = filtered.filter(course => course.price === 0);
        } else if (appState.currentFilters.price === 'paid') {
            filtered = filtered.filter(course => course.price > 0);
        }
    }
    
    // Ordenar
    switch (appState.currentFilters.sort) {
        case 'recent':
            // Mantener orden original (más recientes primero)
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
        default:
            filtered.sort((a, b) => b.students - a.students);
            break;
    }
    
    return filtered;
}

// Función para agregar event listeners a las tarjetas de curso
function addCourseCardListeners(container) {
    container.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', () => {
            const courseId = parseInt(card.dataset.courseId);
            openCourseModal(courseId);
        });
    });
}

// Función para abrir modal de curso
function openCourseModal(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    const modal = document.getElementById('courseModal');
    if (!modal) return;
    
    // Actualizar contenido del modal
    const modalTitle = document.getElementById('courseModalTitle');
    const modalContent = document.getElementById('courseModalContent');
    
    if (modalTitle) modalTitle.textContent = course.title;
    
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="course-detail">
                <div class="course-header">
                    <div class="course-image-large">
                        <i class="${course.image}"></i>
                    </div>
                    <div class="course-info">
                        <h2>${course.title}</h2>
                        <p class="course-description">${course.description}</p>
                        <div class="course-meta-large">
                            <div class="meta-item">
                                <i class="fas fa-signal"></i>
                                <span>Nivel: ${course.level}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>Duración: ${course.duration}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-play-circle"></i>
                                <span>${course.lessons} lecciones</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span>${course.students} estudiantes</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-star"></i>
                                <span>${course.rating} (${Math.floor(Math.random() * 500 + 100)} reseñas)</span>
                            </div>
                            ${course.certificate ? '<div class="meta-item"><i class="fas fa-certificate"></i><span>Certificado incluido</span></div>' : ''}
                        </div>
                        <div class="instructor-info">
                            <div class="instructor-avatar-large">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <h4>Instructor: ${course.instructor}</h4>
                                <p>Experto en ${course.category} con más de 5 años de experiencia</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="course-content-detail">
                    <h3>¿Qué aprenderás?</h3>
                    <ul class="learning-objectives">
                        <li><i class="fas fa-check"></i> Conceptos fundamentales y avanzados</li>
                        <li><i class="fas fa-check"></i> Proyectos prácticos del mundo real</li>
                        <li><i class="fas fa-check"></i> Mejores prácticas de la industria</li>
                        <li><i class="fas fa-check"></i> Herramientas y tecnologías actuales</li>
                    </ul>
                    <div class="course-actions">
                        <div class="price-section">
                            <span class="price-label">Precio:</span>
                            <span class="price-value ${course.price === 0 ? 'free' : ''}">
                                ${course.price === 0 ? 'Gratis' : `€${course.price}`}
                            </span>
                        </div>
                        <div class="action-buttons">
                            <button class="btn btn-primary btn-lg" onclick="enrollCourse(${course.id})">
                                <i class="fas fa-play"></i>
                                ${course.price === 0 ? 'Comenzar Gratis' : 'Inscribirse Ahora'}
                            </button>
                            <button class="btn btn-secondary" onclick="toggleFavorite(${course.id})">
                                <i class="fas fa-heart"></i>
                                Favorito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    openModal('courseModal');
}

// Función para abrir modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Si es el modal de demo, cargar el video
        if (modalId === 'demoModal') {
            loadDemoVideo();
        }
    }
}

// Función para cerrar modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Si es el modal de demo, pausar el video
        if (modalId === 'demoModal') {
            pauseDemoVideo();
        }
    }
}

// Función para cargar el video de demo
function loadDemoVideo() {
    const video = document.getElementById('demoVideo');
    if (video) {
        // El video ya está cargado en el HTML, solo necesitamos asegurarnos de que esté visible
        console.log('Video de demo cargado');
    }
}

// Función para pausar el video de demo
function pauseDemoVideo() {
    const video = document.getElementById('demoVideo');
    if (video) {
        // Pausar el video cuando se cierra el modal
        video.src = video.src; // Esto reinicia el video
        console.log('Video de demo pausado');
    }
}

// Función para inscribirse en curso
function enrollCourse(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    showNotification(
        `¡Te has inscrito exitosamente en "${course.title}"!`,
        'success'
    );
    
    closeModal('courseModal');
}

// Función para agregar a favoritos
function toggleFavorite(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return;
    
    showNotification(`"${course.title}" agregado a favoritos`, 'success');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const container = getOrCreateNotificationContainer();
    
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
    
    // Event listener para cerrar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification);
    });
    
    container.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        removeNotification(notification);
    }, 5000);
}

// Función para obtener icono de notificación
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Función para obtener o crear contenedor de notificaciones
function getOrCreateNotificationContainer() {
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    return container;
}

// Función para remover notificación
function removeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Función para limpiar filtros
function clearFilters() {
    appState.currentFilters = {
        category: '',
        level: '',
        price: '',
        sort: 'popular'
    };
    appState.searchQuery = '';
    
    // Limpiar campos de filtro
    const categoryFilter = document.querySelector('#categoryFilter');
    const levelFilter = document.querySelector('#levelFilter');
    const priceFilter = document.querySelector('#priceFilter');
    const sortFilter = document.querySelector('#sortFilter');
    const searchInput = document.querySelector('#searchInput');
    
    if (categoryFilter) categoryFilter.value = '';
    if (levelFilter) levelFilter.value = '';
    if (priceFilter) priceFilter.value = '';
    if (sortFilter) sortFilter.value = 'popular';
    if (searchInput) searchInput.value = '';
    
    // Renderizar todos los cursos
    renderAllCourses();
}

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Función para filtrar por categoría
function filterByCategory(categoryId) {
    // Mapear categorías del HTML a las del JavaScript
    const categoryMapping = {
        'desarrollo': 'programacion',
        'diseno': 'diseno',
        'marketing': 'marketing',
        'negocios': 'negocios',
        'idiomas': 'idiomas',
        'datos': 'datos',
        'fotografia': 'diseno'
    };
    
    const mappedCategory = categoryMapping[categoryId] || categoryId;
    appState.currentFilters.category = mappedCategory;
    
    // Actualizar select de categoría
    const categorySelect = document.querySelector('#categoryFilter');
    if (categorySelect) {
        categorySelect.value = mappedCategory;
    }
    
    // Scroll a la sección de cursos
    scrollToSection('courses');
    
    // Filtrar y renderizar
    renderAllCourses();
}

// Función para configurar event listeners
function setupEventListeners() {
    // Búsqueda de cursos
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            appState.searchQuery = e.target.value.toLowerCase();
            renderAllCourses();
        });
    }
    
    // Filtros de cursos
    const categoryFilter = document.querySelector('#categoryFilter');
    const levelFilter = document.querySelector('#levelFilter');
    const priceFilter = document.querySelector('#priceFilter');
    const sortFilter = document.querySelector('#sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            appState.currentFilters.category = e.target.value || '';
            renderAllCourses();
        });
    }
    
    if (levelFilter) {
        levelFilter.addEventListener('change', (e) => {
            appState.currentFilters.level = e.target.value || '';
            renderAllCourses();
        });
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', (e) => {
            appState.currentFilters.price = e.target.value || '';
            renderAllCourses();
        });
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            appState.currentFilters.sort = e.target.value || 'popular';
            renderAllCourses();
        });
    }
    
    // Botones del hero
    const exploreButton = document.querySelector('.hero-actions .btn-primary');
    if (exploreButton) {
        exploreButton.addEventListener('click', () => {
            scrollToSection('courses');
        });
    }
    
    const demoButton = document.querySelector('.hero-actions .btn-secondary');
    if (demoButton) {
        demoButton.addEventListener('click', () => {
            openModal('demoModal');
        });
    }
    
    // Categorías
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.category;
            filterByCategory(categoryId);
        });
    });
    
    // Cerrar modales
    document.querySelectorAll('.modal-close, .modal').forEach(element => {
        element.addEventListener('click', (e) => {
            if (e.target === element || e.target.classList.contains('modal-close')) {
                const modal = element.closest('.modal');
                if (modal) {
                    closeModal(modal.id);
                }
            }
        });
    });
    
    // Prevenir cierre al hacer clic en el contenido del modal
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal.id);
            }
        }
    });
}

// Función principal de inicialización
function init() {
    console.log('=== INICIANDO APLICACIÓN ===');
    
    // Verificar que el DOM está listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        return;
    }
    
    console.log('DOM listo, renderizando contenido...');
    
    // Renderizar cursos
    renderFeaturedCourses();
    renderAllCourses();
    
    // Configurar event listeners
    setupEventListeners();
    
    console.log('=== APLICACIÓN INICIADA CORRECTAMENTE ===');
}

// Iniciar la aplicación
init();

console.log('=== SCRIPT CARGADO ===');
