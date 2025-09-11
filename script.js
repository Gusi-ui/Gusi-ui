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

        // Enviar formulario a Netlify Forms
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
        .then(function(response) {
            if (response.ok) {
                showNotification('Mensaje enviado correctamente. Te contactaré pronto.', 'success');
                
                // Limpiar formulario
                contactForm.reset();
                
                // Redirigir a WhatsApp con el mensaje
                const whatsappMessage = `Hola! Me llamo ${name} y estoy interesado en el servicio de ${service}. ${message}`;
                const whatsappUrl = `https://wa.me/34619027645?text=${encodeURIComponent(whatsappMessage)}`;
                
                // Abrir WhatsApp después de un breve delay
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                }, 2000);
            } else {
                throw new Error('Error en el envío');
            }
        })
        .catch(function(error) {
            console.error('Error al enviar formulario:', error);
            showNotification('Error al enviar el mensaje. Por favor, inténtalo de nuevo o contáctame por WhatsApp.', 'error');
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

// Monitoreo completo de Core Web Vitals con métricas detalladas
function initWebVitalsMonitoring() {
    if ('webVitals' in window) {
        // Configurar opciones de monitoreo
        const webVitalsOptions = {
            reportAllChanges: true,
            durationThreshold: 1000
        };

        // Monitorear Largest Contentful Paint (LCP)
        webVitals.getLCP(function(metric) {
            console.log('LCP:', metric.value, 'ms');
            console.log('LCP Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics (si está configurado)
            sendToAnalytics('LCP', metric);
        }, webVitalsOptions);

        // Monitorear First Input Delay (FID)
        webVitals.getFID(function(metric) {
            console.log('FID:', metric.value, 'ms');
            console.log('FID Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('FID', metric);
        }, webVitalsOptions);

        // Monitorear Cumulative Layout Shift (CLS)
        webVitals.getCLS(function(metric) {
            console.log('CLS:', metric.value);
            console.log('CLS Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('CLS', metric);
        }, webVitalsOptions);

        // Monitorear First Contentful Paint (FCP)
        webVitals.getFCP(function(metric) {
            console.log('FCP:', metric.value, 'ms');
            console.log('FCP Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('FCP', metric);
        }, webVitalsOptions);

        // Monitorear Time to First Byte (TTFB)
        webVitals.getTTFB(function(metric) {
            console.log('TTFB:', metric.value, 'ms');
            console.log('TTFB Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('TTFB', metric);
        }, webVitalsOptions);

        console.log('Web Vitals monitoring iniciado');
    } else {
        console.log('Web Vitals no disponible');
    }
}

// Función para enviar métricas a analytics (puede ser extendida)
function sendToAnalytics(metricName, metric) {
    // Aquí puedes integrar con Google Analytics, Google Tag Manager, o tu sistema de tracking
    const data = {
        event: 'web_vitals',
        metric_name: metricName,
        value: metric.value,
        rating: metric.rating,
        timestamp: Date.now(),
        page_url: window.location.href,
        user_agent: navigator.userAgent
    };

    // Integración con Google Analytics 4 (GA4)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'web_vitals', {
            metric_name: metricName,
            value: metric.value,
            rating: metric.rating,
            // Información adicional para análisis
            page_path: window.location.pathname,
            page_title: document.title,
            // Dimensiones personalizadas para segmentación
            metric_id: metric.id,
            navigation_type: performance.getEntriesByType('navigation')[0]?.type || 'navigate'
        });
    }

    // Enviar a endpoint personalizado para backup
    if (typeof navigator.sendBeacon !== 'undefined') {
        const analyticsEndpoint = 'https://your-analytics-endpoint.com/api/web-vitals';
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        navigator.sendBeacon(analyticsEndpoint, blob);
    }

    console.log('Metrica enviada a analytics:', data);
}

// Configuración avanzada de Web Vitals con thresholds personalizados
function getWebVitalsConfig() {
    return {
        reportAllChanges: true,
        durationThreshold: 1000,
        // Thresholds específicos para tu aplicación
        thresholds: {
            LCP: 2500,    // 2.5 segundos
            FID: 100,     // 100 milisegundos  
            CLS: 0.1,     // 0.1
            FCP: 1800,    // 1.8 segundos
            TTFB: 600     // 600 milisegundos
        }
    };
}

// Monitoreo completo de Core Web Vitals con métricas detalladas
function initWebVitalsMonitoring() {
    if ('webVitals' in window) {
        const config = getWebVitalsConfig();

        // Monitorear Largest Contentful Paint (LCP)
        webVitals.getLCP(function(metric) {
            console.log('LCP:', metric.value, 'ms');
            console.log('LCP Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('LCP', metric);
            
            // Alertar si está fuera de los objetivos
            if (metric.value > config.thresholds.LCP) {
                console.warn('⚠️ LCP necesita mejora:', metric.value, 'ms');
            }
        }, config);

        // Monitorear First Input Delay (FID)
        webVitals.getFID(function(metric) {
            console.log('FID:', metric.value, 'ms');
            console.log('FID Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('FID', metric);
            
            if (metric.value > config.thresholds.FID) {
                console.warn('⚠️ FID necesita mejora:', metric.value, 'ms');
            }
        }, config);

        // Monitorear Cumulative Layout Shift (CLS)
        webVitals.getCLS(function(metric) {
            console.log('CLS:', metric.value);
            console.log('CLS Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('CLS', metric);
            
            if (metric.value > config.thresholds.CLS) {
                console.warn('⚠️ CLS necesita mejora:', metric.value);
            }
        }, config);

        // Monitorear First Contentful Paint (FCP)
        webVitals.getFCP(function(metric) {
            console.log('FCP:', metric.value, 'ms');
            console.log('FCP Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('FCP', metric);
            
            if (metric.value > config.thresholds.FCP) {
                console.warn('⚠️ FCP necesita mejora:', metric.value, 'ms');
            }
        }, config);

        // Monitorear Time to First Byte (TTFB)
        webVitals.getTTFB(function(metric) {
            console.log('TTFB:', metric.value, 'ms');
            console.log('TTFB Details:', {
                id: metric.id,
                name: metric.name,
                rating: metric.rating,
                entries: metric.entries
            });
            
            // Enviar a analytics
            sendToAnalytics('TTFB', metric);
            
            if (metric.value > config.thresholds.TTFB) {
                console.warn('⚠️ TTFB necesita mejora:', metric.value, 'ms');
            }
        }, config);

        console.log('Web Vitals monitoring iniciado con configuración:', config);
    } else {
        console.log('Web Vitals no disponible');
    }
}

// Iniciar monitoreo cuando la página esté completamente cargada
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
                console.log('Service Worker registrado con éxito:', registration);
                
                // Verificar actualizaciones periódicamente
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    console.log('Nueva versión de Service Worker encontrada:', newWorker);
                });
            })
            .catch(error => {
                console.log('Error registrando Service Worker:', error);
            });
    }
}

// Registrar Service Worker cuando la página esté cargada
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
} else {
    registerServiceWorker();
}

// ===== MANEJO DE ERRORES =====
window.addEventListener('error', function(e) {
    console.error('Error en la aplicación:', e.error);
});