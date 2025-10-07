// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initProjectFilters();
    initContactForm();
    initHeaderScroll();
    initSmoothScrolling();
});

window.addEventListener('load', function() {
    // Añadir animaciones después de que todo esté cargado
    addLoadAnimations();
});

// ===== NAVEGACIÓN =====
function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle del menú móvil
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            // Actualizar atributos ARIA
            navToggle.setAttribute('aria-expanded', isExpanded);
            navMenu.setAttribute('aria-hidden', !isExpanded);
        });

        // Soporte para navegación por teclado
        navToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navToggle.click();
            }
        });
    }

    // Cerrar menú al hacer click en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            // Restaurar atributos ARIA
            navToggle.setAttribute('aria-expanded', 'false');
            navMenu.setAttribute('aria-hidden', 'true');
        });
    });

    // Navegación por teclado en el menú
    if (navMenu) {
        navMenu.addEventListener('keydown', function(e) {
            const links = Array.from(navMenu.querySelectorAll('.nav-link'));
            const currentIndex = links.indexOf(document.activeElement);
            
            if (e.key === 'Escape') {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
                navToggle.focus();
            } else if (e.key === 'Tab') {
                if (currentIndex === links.length - 1 && !e.shiftKey) {
                    e.preventDefault();
                    links[0].focus();
                } else if (currentIndex === 0 && e.shiftKey) {
                    e.preventDefault();
                    links[links.length - 1].focus();
                }
            }
        });
    }

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// ===== EFECTOS DE SCROLL =====
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    function updateHeader() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    }

    // Debounce para mejor rendimiento
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', function() {
        ticking = false;
        requestTick();
    });
}

// ===== ANIMACIONES AL SCROLL =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elementos a observar
    const elementsToAnimate = [
        '.section-header',
        '.service-card',
        '.project-card',
        '.contact-item',
        '.hero-text',
        '.hero-visual'
    ];

    elementsToAnimate.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            // Añadir delay escalonado para las tarjetas
            if (selector === '.service-card' || selector === '.project-card') {
                element.style.animationDelay = `${index * 0.1}s`;
            }
            observer.observe(element);
        });
    });
}

// ===== FILTROS DE PROYECTOS =====
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterButtons.length === 0 || projectCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Evento de Google Analytics: Filtro de proyectos
            if (typeof gtag !== 'undefined') {
                gtag('event', 'project_filter', {
                    'event_category': 'Portfolio',
                    'event_label': filter,
                    'custom_parameter_1': 'filter_button'
                });
            }

            // Filtrar proyectos con animación
            projectCards.forEach((card, index) => {
                const projectType = card.getAttribute('data-project-type');
                
                if (filter === 'all' || projectType === filter) {
                    // Mostrar proyecto con delay escalonado
                    setTimeout(() => {
                        card.style.display = 'block';
                        card.style.animation = 'fadeInUp 0.6s ease-out';
                    }, index * 100);
                } else {
                    // Ocultar proyecto
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Agregar eventos para clics en tarjetas de proyectos
    projectCards.forEach(card => {
        card.addEventListener('click', function() {
            const projectTitle = this.querySelector('h3')?.textContent || 'Unknown Project';
            const projectCategory = this.getAttribute('data-project-type') || 'unknown';
            
            // Evento de Google Analytics: Clic en proyecto
            if (typeof gtag !== 'undefined') {
                gtag('event', 'project_click', {
                    'event_category': 'Portfolio',
                    'event_label': projectTitle,
                    'custom_parameter_1': projectCategory
                });
            }
        });
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');

        // Función para sanitizar texto y evitar problemas con caracteres Unicode
        function sanitizeText(text) {
            if (!text) return '';
            // Convertir a string y limpiar caracteres problemáticos
            return String(text)
                .replace(/[\uD800-\uDFFF]/g, '') // Eliminar surrogates sueltos
                .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // Eliminar caracteres de control
                .trim();
        }

        // Validación básica
        if (!name || !email || !service || !message) {
            showNotification('Por favor, completa todos los campos', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Por favor, introduce un email válido', 'error');
            return;
        }

        // Mostrar loading
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        submitBtn.disabled = true;

        // Evento de Google Analytics: Inicio de envío de formulario
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit_start', {
                'event_category': 'Contact',
                'event_label': service,
                'custom_parameter_1': 'contact_form'
            });
        }

        // Sanitizar datos antes de enviar
        const sanitizedName = sanitizeText(name);
        const sanitizedEmail = sanitizeText(email);
        const sanitizedService = sanitizeText(service);
        const sanitizedMessage = sanitizeText(message);

        // Crear objeto de datos sanitizado
        const formDataObj = {
            name: sanitizedName,
            email: sanitizedEmail,
            service: sanitizedService,
            message: sanitizedMessage,
            _subject: `Nuevo mensaje de contacto desde Gusi.dev - ${sanitizedService}`,
            _replyto: sanitizedEmail
        };

        // Verificar que los datos sean válidos antes de enviar
        if (!sanitizedName || !sanitizedEmail || !sanitizedService || !sanitizedMessage) {
            showNotification('Por favor, completa todos los campos correctamente', 'error');
            return;
        }

        // Enviar formulario a Formspree (compatible con GitHub Pages)
        let jsonString;
        try {
            jsonString = JSON.stringify(formDataObj);
        } catch (jsonError) {
            console.error('Error al convertir datos a JSON:', jsonError);
            showNotification('Error al procesar los datos del formulario. Por favor, inténtalo de nuevo.', 'error');
            return;
        }

        fetch('https://formspree.io/f/xeorlovl', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: jsonString
        })
        .then(function(response) {
            if (response.ok) {
                // Evento de Google Analytics: Formulario enviado exitosamente
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submit_success', {
                        'event_category': 'Contact',
                        'event_label': service,
                        'value': 1,
                        'custom_parameter_1': 'contact_form'
                    });

                    // Evento de conversión
                    gtag('event', 'conversion', {
                        'send_to': 'G-165E9VQDD8',
                        'event_category': 'Lead',
                        'event_label': 'Contact Form Submission'
                    });
                }

                // Limpiar formulario
                contactForm.reset();

                // Redirigir a página específica según el servicio
                let redirectUrl = '';
                switch(service) {
                    case 'web':
                        redirectUrl = 'gracias-web.html';
                        break;
                    case 'mobile':
                        redirectUrl = 'gracias-mobile.html';
                        break;
                    case 'ecommerce':
                        redirectUrl = 'gracias-ecommerce.html';
                        break;
                    case 'maintenance':
                        redirectUrl = 'gracias-mantenimiento.html';
                        break;
                    case 'other':
                        redirectUrl = 'gracias-otros.html';
                        break;
                    default:
                        redirectUrl = 'gracias.html';
                }

                // Evento de Google Analytics: Redirección a página de éxito
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'success_page_redirect', {
                        'event_category': 'Engagement',
                        'event_label': service,
                        'custom_parameter_1': redirectUrl
                    });
                }

                // Redirigir a la página de éxito
                window.location.href = redirectUrl;
            } else {
                // Intentar obtener el mensaje de error del servidor
                return response.text().then(function(errorText) {
                    throw new Error(`Error del servidor (${response.status}): ${response.statusText}. Detalles: ${errorText}`);
                });
            }
        })
        .catch(function(error) {

            // Evento de Google Analytics: Error en el envío del formulario
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit_error', {
                    'event_category': 'Contact',
                    'event_label': service,
                    'custom_parameter_1': 'contact_form',
                    'custom_parameter_2': error.message
                });
            }

            // Crear página de error con información detallada
            const errorInfo = {
                message: error.message,
                service: service,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            };

            // Guardar información del error para mostrar en la página de error
            sessionStorage.setItem('formError', JSON.stringify(errorInfo));

            // Redirigir a página de error
            if (typeof gtag !== 'undefined') {
                gtag('event', 'error_page_redirect', {
                    'event_category': 'Error',
                    'event_label': 'Form Submission Failed',
                    'custom_parameter_1': service
                });
            }

            window.location.href = 'error.html';
        })
        .finally(function() {
            // Restaurar botón
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Evento de Google Analytics: Navegación interna
            if (typeof gtag !== 'undefined') {
                gtag('event', 'internal_navigation', {
                    'event_category': 'Navigation',
                    'event_label': targetId,
                    'custom_parameter_1': 'smooth_scroll'
                });
            }
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMACIONES AL CARGAR =====
function addLoadAnimations() {
    // Animación del hero
    const heroText = document.querySelector('.hero-text');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroText) {
        heroText.classList.add('slide-in-left');
    }
    
    if (heroVisual) {
        heroVisual.classList.add('slide-in-right');
    }

    // Animación de las estadísticas
    animateCounters();
}

// ===== ANIMACIÓN DE CONTADORES =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        // Iniciar animación cuando el elemento sea visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ===== UTILIDADES =====

// Validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos de la notificación
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 300px;
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== EFECTOS INTERACTIVOS =====

// Efecto parallax suave en el hero
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroPattern = document.querySelector('.hero-pattern');
    
    if (!hero || !heroPattern) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (heroPattern) {
            heroPattern.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Inicializar efecto parallax
initParallaxEffect();

// ===== OPTIMIZACIONES DE RENDIMIENTO =====

// Lazy loading avanzado para imágenes con priorización
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window && 'requestIdleCallback' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Cargar imágenes críticas inmediatamente, otras en idle time
                    if (img.classList.contains('critical-image')) {
                        loadImage(img);
                    } else {
                        requestIdleCallback(() => loadImage(img));
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px', // Cargar 200px antes de entrar en viewport
            threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback para navegadores que no soportan APIs modernas
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

function loadImage(img) {
    // Precargar imagen antes de asignar al src
    const tempImg = new Image();
    tempImg.onload = function() {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
    };
    tempImg.src = img.dataset.src;
}

// Inicializar lazy loading
requestIdleCallback(() => initLazyLoading());

// ===== CORE WEB VITALS OPTIMIZATIONS =====

// Esta función se ha movido más abajo en el archivo con mejoras

// Función para enviar métricas a analytics (optimizada)
function sendToAnalytics(metricName, metric) {
    // Solo enviar a Google Analytics si está disponible
    if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
            metric_name: metricName,
            value: metric.value,
            rating: metric.rating,
            page_path: window.location.pathname,
            page_title: document.title,
            metric_id: metric.id,
            navigation_type: performance.getEntriesByType('navigation')[0]?.type || 'navigate'
        });
    }
}

// Configuración simplificada y optimizada de Web Vitals
function initWebVitalsMonitoring() {
    // Verificar que la librería esté disponible
    if (typeof webVitals === 'undefined') {
        setTimeout(initWebVitalsMonitoring, 100);
        return;
    }

    try {
        // Configuración básica optimizada
        const config = {
            reportAllChanges: false,
            durationThreshold: 1000
        };

        // LCP - Largest Contentful Paint
        webVitals.onLCP(function(metric) {
            sendToAnalytics('LCP', metric);
        }, config);

        // INP - Interaction to Next Paint (métricas modernas)
        if (webVitals.onINP) {
            webVitals.onINP(function(metric) {
                sendToAnalytics('INP', metric);
            }, config);
        }

        // FID - First Input Delay (compatibilidad)
        if (webVitals.onFID) {
            webVitals.onFID(function(metric) {
                sendToAnalytics('FID', metric);
            }, config);
        }

        // CLS - Cumulative Layout Shift
        webVitals.onCLS(function(metric) {
            sendToAnalytics('CLS', metric);
        }, config);

        // FCP - First Contentful Paint
        webVitals.onFCP(function(metric) {
            sendToAnalytics('FCP', metric);
        }, config);

        // TTFB - Time to First Byte
        webVitals.onTTFB(function(metric) {
            sendToAnalytics('TTFB', metric);
        }, config);

    } catch (error) {
        // Error silencioso en producción
    }
}

// Iniciar monitoreo optimizado
if (document.readyState === 'complete') {
    initWebVitalsMonitoring();
} else {
    window.addEventListener('load', initWebVitalsMonitoring);
}

// Prevenir Cumulative Layout Shift (CLS)
function preventLayoutShift() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.aspectRatio = img.width / img.height;
        }
    });
    
    // Reservar espacio para elementos dinámicos
    const dynamicElements = document.querySelectorAll('.hero-image, .project-image');
    dynamicElements.forEach(el => {
        el.style.minHeight = el.offsetHeight + 'px';
    });
}

document.addEventListener('DOMContentLoaded', preventLayoutShift);
window.addEventListener('load', preventLayoutShift);

// ===== SERVICE WORKER REGISTRATION =====
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                // Verificar actualizaciones periódicamente
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                });
            })
            .catch(error => {
                // Error silencioso en producción
            });
    }
}

// Registrar Service Worker cuando la página esté cargada
function shouldRegisterServiceWorker() {
    try {
        const host = location.hostname;
        // No registrar el SW en entorno local o en previews sin dominio
        if (host === 'localhost' || host === '127.0.0.1' || host === '') return false;
    } catch (e) {
        return false;
    }
    return true;
}

if (shouldRegisterServiceWorker()) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registerServiceWorker);
    } else {
        registerServiceWorker();
    }
} else {
    // Registro omitido en entorno local
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    // Error manejado silenciosamente en producción
});

// ===== DARK MODE (tema oscuro) =====
function applyTheme(isDark) {
    const root = document.documentElement;
    const icon = document.getElementById('theme-icon');
    
    if (isDark) {
        root.classList.add('dark');
        if (icon) icon.textContent = '☀️';
        
        // Evento de Google Analytics: Dark mode activado
        if (typeof gtag !== 'undefined') {
            gtag('event', 'dark_mode_enabled', {
                'event_category': 'Theme',
                'event_label': 'Dark Mode',
                'custom_parameter_1': 'theme_toggle'
            });
        }
    } else {
        root.classList.remove('dark');
        if (icon) icon.textContent = '🌙';
        
        // Evento de Google Analytics: Light mode activado
        if (typeof gtag !== 'undefined') {
            gtag('event', 'light_mode_enabled', {
                'event_category': 'Theme',
                'event_label': 'Light Mode',
                'custom_parameter_1': 'theme_toggle'
            });
        }
    }

    // Actualizar meta theme-color para navegadores móviles
    updateMetaThemeColor(isDark);
    
    // Añadir transición suave
    root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Forzar re-render para asegurar que los cambios se apliquen
    setTimeout(() => {
        root.style.display = 'none';
        root.offsetHeight; // Trigger reflow
        root.style.display = '';
    }, 10);
}

function updateMetaThemeColor(isDark) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.name = 'theme-color';
        document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = isDark ? '#0f172a' : '#ffffff';
}

function getInitialTheme() {
    const stored = localStorage.getItem('site-theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;

    // Si no hay preferencia guardada, usar prefers-color-scheme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return true;
    return false;
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const next = !isDark;
    applyTheme(next);
    
    try {
        localStorage.setItem('site-theme', next ? 'dark' : 'light');
    } catch (e) {
        // Error silencioso en producción
    }
    
    // Mostrar notificación del cambio
    showNotification(
        `Modo ${next ? 'oscuro' : 'claro'} activado`, 
        'success'
    );
}

// Escuchar cambios en prefers-color-scheme
function watchSystemTheme() {
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            // Solo aplicar si no hay preferencia guardada
            const stored = localStorage.getItem('site-theme');
            if (!stored) {
                applyTheme(e.matches);
            }
        });
    }
}

// Inicializar tema al cargar
document.addEventListener('DOMContentLoaded', function() {
    const initialDark = getInitialTheme();
    applyTheme(initialDark);
    watchSystemTheme();

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleTheme();
        });
        
        // Soporte para navegación por teclado
        toggleBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
});

// Exportar función por si se quiere usar desde consola
window.toggleTheme = toggleTheme;