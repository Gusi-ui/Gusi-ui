// Global Configuration
const CONFIG = {
    APP_NAME: 'MediCitas',
    VERSION: '1.0.0',
    API_BASE_URL: '/api',
    STORAGE_PREFIX: 'medicitas_',
    NOTIFICATION_DURATION: 5000,
    ANIMATION_DURATION: 300
};

// Application State
const AppState = {
    currentUser: null,
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,
    currentStep: 1,
    appointments: [],
    doctors: [],
    services: [],
    prescriptions: []
};

// Sample Data
const SAMPLE_SERVICES = [
    {
        id: 1,
        name: 'Consulta General',
        description: 'Evaluación médica completa y diagnóstico inicial',
        icon: 'fas fa-stethoscope',
        duration: 30,
        price: 50,
        features: ['Examen físico completo', 'Diagnóstico inicial', 'Plan de tratamiento', 'Receta médica']
    },
    {
        id: 2,
        name: 'Cardiología',
        description: 'Especialista en enfermedades del corazón y sistema cardiovascular',
        icon: 'fas fa-heartbeat',
        duration: 45,
        price: 80,
        features: ['Electrocardiograma', 'Ecocardiograma', 'Monitoreo cardíaco', 'Plan preventivo']
    },
    {
        id: 3,
        name: 'Dermatología',
        description: 'Cuidado especializado de la piel, cabello y uñas',
        icon: 'fas fa-hand-holding-medical',
        duration: 30,
        price: 65,
        features: ['Examen dermatológico', 'Biopsia si necesario', 'Tratamiento especializado', 'Seguimiento']
    },
    {
        id: 4,
        name: 'Pediatría',
        description: 'Atención médica especializada para niños y adolescentes',
        icon: 'fas fa-baby',
        duration: 30,
        price: 55,
        features: ['Control de crecimiento', 'Vacunación', 'Desarrollo infantil', 'Orientación padres']
    },
    {
        id: 5,
        name: 'Ginecología',
        description: 'Salud integral de la mujer y sistema reproductivo',
        icon: 'fas fa-female',
        duration: 40,
        price: 70,
        features: ['Examen ginecológico', 'Citología', 'Ecografía', 'Planificación familiar']
    },
    {
        id: 6,
        name: 'Traumatología',
        description: 'Tratamiento de lesiones del sistema musculoesquelético',
        icon: 'fas fa-bone',
        duration: 35,
        price: 75,
        features: ['Evaluación ortopédica', 'Radiografías', 'Tratamiento lesiones', 'Rehabilitación']
    }
];

const SAMPLE_DOCTORS = [
    {
        id: 1,
        name: 'Dr. María González',
        specialty: 'cardiologia',
        specialtyName: 'Cardiología',
        experience: 15,
        rating: 4.9,
        reviews: 127,
        avatar: 'MG',
        availability: 'available',
        schedule: {
            monday: ['09:00', '10:00', '11:00', '15:00', '16:00'],
            tuesday: ['09:00', '10:00', '11:00', '15:00', '16:00'],
            wednesday: ['09:00', '10:00', '11:00'],
            thursday: ['09:00', '10:00', '11:00', '15:00', '16:00'],
            friday: ['09:00', '10:00', '11:00', '15:00']
        },
        bio: 'Especialista en cardiología con más de 15 años de experiencia en el diagnóstico y tratamiento de enfermedades cardiovasculares.'
    },
    {
        id: 2,
        name: 'Dr. Carlos Ruiz',
        specialty: 'dermatologia',
        specialtyName: 'Dermatología',
        experience: 12,
        rating: 4.8,
        reviews: 89,
        avatar: 'CR',
        availability: 'available',
        schedule: {
            monday: ['10:00', '11:00', '12:00', '16:00', '17:00'],
            tuesday: ['10:00', '11:00', '12:00', '16:00', '17:00'],
            wednesday: ['10:00', '11:00', '12:00', '16:00', '17:00'],
            thursday: ['10:00', '11:00', '12:00'],
            friday: ['10:00', '11:00', '12:00', '16:00', '17:00']
        },
        bio: 'Dermatólogo certificado especializado en dermatología clínica y estética, con enfoque en tratamientos innovadores.'
    },
    {
        id: 3,
        name: 'Dra. Ana Martínez',
        specialty: 'pediatria',
        specialtyName: 'Pediatría',
        experience: 18,
        rating: 4.9,
        reviews: 156,
        avatar: 'AM',
        availability: 'available',
        schedule: {
            monday: ['08:00', '09:00', '10:00', '11:00', '15:00'],
            tuesday: ['08:00', '09:00', '10:00', '11:00', '15:00'],
            wednesday: ['08:00', '09:00', '10:00', '11:00'],
            thursday: ['08:00', '09:00', '10:00', '11:00', '15:00'],
            friday: ['08:00', '09:00', '10:00', '11:00']
        },
        bio: 'Pediatra con amplia experiencia en el cuidado integral de niños desde recién nacidos hasta adolescentes.'
    },
    {
        id: 4,
        name: 'Dr. Luis Fernández',
        specialty: 'traumatologia',
        specialtyName: 'Traumatología',
        experience: 20,
        rating: 4.7,
        reviews: 203,
        avatar: 'LF',
        availability: 'busy',
        schedule: {
            monday: ['14:00', '15:00', '16:00', '17:00'],
            tuesday: ['14:00', '15:00', '16:00', '17:00'],
            wednesday: ['14:00', '15:00', '16:00', '17:00'],
            thursday: ['14:00', '15:00', '16:00'],
            friday: ['14:00', '15:00', '16:00', '17:00']
        },
        bio: 'Traumatólogo especializado en cirugía ortopédica y medicina deportiva con más de 20 años de experiencia.'
    },
    {
        id: 5,
        name: 'Dra. Carmen López',
        specialty: 'ginecologia',
        specialtyName: 'Ginecología',
        experience: 14,
        rating: 4.8,
        reviews: 134,
        avatar: 'CL',
        availability: 'available',
        schedule: {
            monday: ['09:00', '10:00', '11:00', '16:00', '17:00'],
            tuesday: ['09:00', '10:00', '11:00', '16:00', '17:00'],
            wednesday: ['09:00', '10:00', '11:00'],
            thursday: ['09:00', '10:00', '11:00', '16:00', '17:00'],
            friday: ['09:00', '10:00', '11:00', '16:00']
        },
        bio: 'Ginecóloga especializada en salud reproductiva y medicina preventiva para la mujer.'
    },
    {
        id: 6,
        name: 'Dr. Roberto Silva',
        specialty: 'neurologia',
        specialtyName: 'Neurología',
        experience: 16,
        rating: 4.9,
        reviews: 98,
        avatar: 'RS',
        availability: 'available',
        schedule: {
            monday: ['10:00', '11:00', '12:00', '15:00', '16:00'],
            tuesday: ['10:00', '11:00', '12:00', '15:00', '16:00'],
            wednesday: ['10:00', '11:00', '12:00'],
            thursday: ['10:00', '11:00', '12:00', '15:00', '16:00'],
            friday: ['10:00', '11:00', '12:00', '15:00']
        },
        bio: 'Neurólogo especializado en trastornos del sistema nervioso y enfermedades neurodegenerativas.'
    }
];

const SAMPLE_APPOINTMENTS = [
    {
        id: 1,
        doctorId: 1,
        doctorName: 'Dr. María González',
        specialty: 'Cardiología',
        date: '2024-01-15',
        time: '10:30',
        status: 'confirmed',
        notes: 'Control rutinario cardiovascular',
        location: 'Consulta 205'
    },
    {
        id: 2,
        doctorId: 3,
        doctorName: 'Dra. Ana Martínez',
        specialty: 'Pediatría',
        date: '2024-01-18',
        time: '09:00',
        status: 'pending',
        notes: 'Revisión de crecimiento',
        location: 'Consulta 102'
    },
    {
        id: 3,
        doctorId: 2,
        doctorName: 'Dr. Carlos Ruiz',
        specialty: 'Dermatología',
        date: '2024-01-12',
        time: '16:00',
        status: 'completed',
        notes: 'Revisión de lunares',
        location: 'Consulta 301'
    }
];

const SAMPLE_PRESCRIPTIONS = [
    {
        id: 1,
        doctorName: 'Dr. María González',
        date: '2024-01-10',
        medications: [
            { name: 'Enalapril 10mg', dosage: '1 tableta cada 12 horas' },
            { name: 'Aspirina 100mg', dosage: '1 tableta diaria' }
        ],
        notes: 'Continuar tratamiento por 3 meses. Control en 30 días.'
    },
    {
        id: 2,
        doctorName: 'Dr. Carlos Ruiz',
        date: '2024-01-08',
        medications: [
            { name: 'Crema hidratante', dosage: 'Aplicar 2 veces al día' },
            { name: 'Protector solar SPF 50', dosage: 'Aplicar cada mañana' }
        ],
        notes: 'Evitar exposición solar directa. Seguimiento en 2 semanas.'
    }
];

// Utility Functions
const Utils = {
    // Debounce function
    debounce(func, wait) {
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

    // Format date
    formatDate(date) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        return new Date(date).toLocaleDateString('es-ES', options);
    },

    // Format time
    formatTime(time) {
        return time;
    },

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Validate phone
    validatePhone(phone) {
        const re = /^[+]?[0-9\s\-\(\)]{9,}$/;
        return re.test(phone);
    },

    // Get day of week
    getDayOfWeek(date) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        return days[new Date(date).getDay()];
    },

    // Check if date is available
    isDateAvailable(date) {
        const today = new Date();
        const selectedDate = new Date(date);
        const dayOfWeek = selectedDate.getDay();
        
        // No weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) return false;
        
        // No past dates
        if (selectedDate < today) return false;
        
        // No dates more than 3 months in advance
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 3);
        if (selectedDate > maxDate) return false;
        
        return true;
    }
};

// Local Storage Manager
const Storage = {
    set(key, value) {
        try {
            localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },

    clear() {
        try {
            Object.keys(localStorage)
                .filter(key => key.startsWith(CONFIG.STORAGE_PREFIX))
                .forEach(key => localStorage.removeItem(key));
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

// Notification System
const NotificationManager = {
    container: null,

    init() {
        this.container = document.querySelector('.notification-container');
    },

    show(message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
        if (!this.container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-header">
                <span class="notification-title">${this.getTitle(type)}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">${message}</div>
        `;

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.remove(notification));

        // Add to container
        this.container.appendChild(notification);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }

        return notification;
    },

    remove(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    },

    getTitle(type) {
        const titles = {
            success: 'Éxito',
            error: 'Error',
            warning: 'Advertencia',
            info: 'Información'
        };
        return titles[type] || 'Notificación';
    },

    success(message) {
        return this.show(message, 'success');
    },

    error(message) {
        return this.show(message, 'error');
    },

    warning(message) {
        return this.show(message, 'warning');
    },

    info(message) {
        return this.show(message, 'info');
    }
};

// Loading Manager
const LoadingManager = {
    overlay: null,

    init() {
        this.overlay = document.querySelector('.loading-overlay');
    },

    show(message = 'Cargando...') {
        if (this.overlay) {
            const messageElement = this.overlay.querySelector('p');
            if (messageElement) {
                messageElement.textContent = message;
            }
            this.overlay.classList.add('active');
        }
    },

    hide() {
        if (this.overlay) {
            this.overlay.classList.remove('active');
        }
    }
};

// Modal Manager
const ModalManager = {
    activeModal: null,

    init() {
        // Add event listeners for modal triggers
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-modal]');
            if (trigger) {
                e.preventDefault();
                const modalId = trigger.getAttribute('data-modal');
                this.open(modalId);
            }

            // Close modal on close button click
            if (e.target.closest('.modal-close')) {
                e.preventDefault();
                this.close();
            }

            // Close modal on overlay click
            if (e.target.classList.contains('modal')) {
                this.close();
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.close();
            }
        });
    },

    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            // Close any active modal first
            this.close();
            
            modal.classList.add('active');
            this.activeModal = modal;
            document.body.style.overflow = 'hidden';

            // Focus first input if available
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    },

    close() {
        if (this.activeModal) {
            this.activeModal.classList.remove('active');
            this.activeModal = null;
            document.body.style.overflow = '';
        }
    }
};

// Services Manager
const ServicesManager = {
    init() {
        this.loadServices();
        this.renderServices();
    },

    loadServices() {
        // Load from storage or use sample data
        AppState.services = Storage.get('services') || SAMPLE_SERVICES;
    },

    renderServices() {
        const container = document.getElementById('services-grid');
        if (!container) return;

        container.innerHTML = AppState.services.map(service => `
            <div class="service-card" data-service-id="${service.id}">
                <div class="service-icon">
                    <i class="${service.icon}"></i>
                </div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <ul class="service-features">
                    ${service.features.map(feature => `
                        <li><i class="fas fa-check"></i> ${feature}</li>
                    `).join('')}
                </ul>
                <div class="service-price">
                    <span class="price">€${service.price}</span>
                    <span class="duration">${service.duration} min</span>
                </div>
                <button class="btn btn-primary" data-modal="schedule-modal">
                    <i class="fas fa-calendar-plus"></i>
                    Agendar Cita
                </button>
            </div>
        `).join('');
    }
};

// Doctors Manager
const DoctorsManager = {
    filteredDoctors: [],

    init() {
        this.loadDoctors();
        this.renderDoctors();
        this.initFilters();
    },

    loadDoctors() {
        // Load from storage or use sample data
        AppState.doctors = Storage.get('doctors') || SAMPLE_DOCTORS;
        this.filteredDoctors = [...AppState.doctors];
    },

    renderDoctors() {
        const container = document.getElementById('doctors-grid');
        if (!container) return;

        container.innerHTML = this.filteredDoctors.map(doctor => `
            <div class="doctor-card" data-doctor-id="${doctor.id}">
                <div class="doctor-avatar">${doctor.avatar}</div>
                <h3>${doctor.name}</h3>
                <div class="doctor-specialty">${doctor.specialtyName}</div>
                <div class="doctor-info">
                    <p><i class="fas fa-graduation-cap"></i> ${doctor.experience} años de experiencia</p>
                </div>
                <div class="doctor-rating">
                    <div class="stars">
                        ${this.generateStars(doctor.rating)}
                    </div>
                    <span class="rating-text">${doctor.rating} (${doctor.reviews} reseñas)</span>
                </div>
                <div class="doctor-availability">
                    <div class="availability-indicator ${doctor.availability === 'busy' ? 'busy' : ''}"></div>
                    <span>${doctor.availability === 'available' ? 'Disponible' : 'Ocupado'}</span>
                </div>
                <div class="doctor-actions">
                    <button class="btn btn-primary" data-modal="schedule-modal" data-doctor-id="${doctor.id}">
                        <i class="fas fa-calendar-plus"></i>
                        Agendar Cita
                    </button>
                    <button class="btn btn-secondary" onclick="DoctorsManager.showDoctorInfo(${doctor.id})">
                        <i class="fas fa-info-circle"></i>
                        Ver Perfil
                    </button>
                </div>
            </div>
        `).join('');
    },

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star empty"></i>';
        }
        
        return stars;
    },

    initFilters() {
        const specialtyFilter = document.getElementById('specialty-filter');
        const availabilityFilter = document.getElementById('availability-filter');

        if (specialtyFilter) {
            specialtyFilter.addEventListener('change', () => this.applyFilters());
        }

        if (availabilityFilter) {
            availabilityFilter.addEventListener('change', () => this.applyFilters());
        }
    },

    applyFilters() {
        const specialtyFilter = document.getElementById('specialty-filter');
        const availabilityFilter = document.getElementById('availability-filter');

        const selectedSpecialty = specialtyFilter?.value || 'all';
        const selectedAvailability = availabilityFilter?.value || 'all';

        this.filteredDoctors = AppState.doctors.filter(doctor => {
            const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
            const matchesAvailability = selectedAvailability === 'all' || 
                (selectedAvailability === 'available' && doctor.availability === 'available') ||
                (selectedAvailability === 'busy' && doctor.availability === 'busy');

            return matchesSpecialty && matchesAvailability;
        });

        this.renderDoctors();
    },

    showDoctorInfo(doctorId) {
        const doctor = AppState.doctors.find(d => d.id === doctorId);
        if (doctor) {
            NotificationManager.info(`${doctor.name} - ${doctor.bio}`);
        }
    },

    getDoctorById(id) {
        return AppState.doctors.find(doctor => doctor.id === parseInt(id));
    }
};

// Appointments Manager
const AppointmentsManager = {
    currentSection: 'upcoming',

    init() {
        this.loadAppointments();
        this.initSidebar();
        this.renderUpcomingAppointments();
        this.renderHistoryAppointments();
        this.renderPrescriptions();
        this.initForms();
    },

    loadAppointments() {
        // Load from storage or use sample data
        AppState.appointments = Storage.get('appointments') || SAMPLE_APPOINTMENTS;
        AppState.prescriptions = Storage.get('prescriptions') || SAMPLE_PRESCRIPTIONS;
    },

    initSidebar() {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.getAttribute('data-section');
                this.showSection(section);
                
                // Update active state
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
            });
        });
    },

    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }
    },

    renderUpcomingAppointments() {
        const container = document.getElementById('upcoming-appointments');
        if (!container) return;

        const upcomingAppointments = AppState.appointments.filter(apt => {
            const aptDate = new Date(apt.date + ' ' + apt.time);
            return aptDate > new Date() && apt.status !== 'cancelled';
        });

        if (upcomingAppointments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-calendar-alt"></i>
                    <h4>No tienes citas próximas</h4>
                    <p>Agenda una nueva cita con nuestros especialistas</p>
                    <button class="btn btn-primary" data-modal="schedule-modal">
                        <i class="fas fa-plus"></i>
                        Agendar Cita
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = upcomingAppointments.map(appointment => `
            <div class="appointment-item" data-appointment-id="${appointment.id}">
                <div class="appointment-header">
                    <div class="appointment-info">
                        <h4>${appointment.doctorName}</h4>
                        <p>${appointment.specialty}</p>
                    </div>
                    <div class="appointment-status status-${appointment.status}">
                        ${this.getStatusText(appointment.status)}
                    </div>
                </div>
                <div class="appointment-details">
                    <div class="detail">
                        <i class="fas fa-calendar"></i>
                        <span>${Utils.formatDate(appointment.date)}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-clock"></i>
                        <span>${appointment.time}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${appointment.location}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-notes-medical"></i>
                        <span>${appointment.notes}</span>
                    </div>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-sm btn-success" onclick="AppointmentsManager.confirmAppointment(${appointment.id})">
                        <i class="fas fa-check"></i>
                        Confirmar
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="AppointmentsManager.rescheduleAppointment(${appointment.id})">
                        <i class="fas fa-calendar-alt"></i>
                        Reprogramar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="AppointmentsManager.cancelAppointment(${appointment.id})">
                        <i class="fas fa-times"></i>
                        Cancelar
                    </button>
                </div>
            </div>
        `).join('');
    },

    renderHistoryAppointments() {
        const container = document.getElementById('history-appointments');
        if (!container) return;

        const historyAppointments = AppState.appointments.filter(apt => {
            const aptDate = new Date(apt.date + ' ' + apt.time);
            return aptDate <= new Date() || apt.status === 'cancelled' || apt.status === 'completed';
        });

        container.innerHTML = historyAppointments.map(appointment => `
            <div class="appointment-item" data-appointment-id="${appointment.id}">
                <div class="appointment-header">
                    <div class="appointment-info">
                        <h4>${appointment.doctorName}</h4>
                        <p>${appointment.specialty}</p>
                    </div>
                    <div class="appointment-status status-${appointment.status}">
                        ${this.getStatusText(appointment.status)}
                    </div>
                </div>
                <div class="appointment-details">
                    <div class="detail">
                        <i class="fas fa-calendar"></i>
                        <span>${Utils.formatDate(appointment.date)}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-clock"></i>
                        <span>${appointment.time}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${appointment.location}</span>
                    </div>
                    <div class="detail">
                        <i class="fas fa-notes-medical"></i>
                        <span>${appointment.notes}</span>
                    </div>
                </div>
                <div class="appointment-actions">
                    <button class="btn btn-sm btn-primary" onclick="AppointmentsManager.viewDetails(${appointment.id})">
                        <i class="fas fa-eye"></i>
                        Ver Detalles
                    </button>
                    ${appointment.status === 'completed' ? `
                        <button class="btn btn-sm btn-secondary" onclick="AppointmentsManager.bookAgain(${appointment.id})">
                            <i class="fas fa-redo"></i>
                            Agendar Otra
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    },

    renderPrescriptions() {
        const container = document.getElementById('prescriptions-list');
        if (!container) return;

        if (AppState.prescriptions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-prescription-bottle-alt"></i>
                    <h4>No tienes recetas médicas</h4>
                    <p>Las recetas de tus consultas aparecerán aquí</p>
                </div>
            `;
            return;
        }

        container.innerHTML = AppState.prescriptions.map(prescription => `
            <div class="prescription-item">
                <div class="prescription-header">
                    <div class="prescription-info">
                        <h4>Receta Médica</h4>
                        <div class="prescription-date">
                            <i class="fas fa-calendar"></i>
                            ${Utils.formatDate(prescription.date)} - ${prescription.doctorName}
                        </div>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="AppointmentsManager.downloadPrescription(${prescription.id})">
                        <i class="fas fa-download"></i>
                        Descargar
                    </button>
                </div>
                <div class="prescription-medications">
                    ${prescription.medications.map(med => `
                        <div class="medication">
                            <span class="medication-name">${med.name}</span>
                            <span class="medication-dosage">${med.dosage}</span>
                        </div>
                    `).join('')}
                </div>
                ${prescription.notes ? `
                    <div class="prescription-notes">
                        <strong>Notas:</strong> ${prescription.notes}
                    </div>
                ` : ''}
            </div>
        `).join('');
    },

    initForms() {
        // Schedule form
        const scheduleForm = document.getElementById('schedule-form');
        if (scheduleForm) {
            scheduleForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleScheduleSubmit(e.target);
            });
        }

        // Populate doctor and service selects
        this.populateSelects();
    },

    populateSelects() {
        const doctorSelect = document.getElementById('doctor-select');
        const serviceSelect = document.getElementById('service-select');

        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Seleccionar doctor</option>' +
                AppState.doctors.map(doctor => `
                    <option value="${doctor.id}">${doctor.name} - ${doctor.specialtyName}</option>
                `).join('');
        }

        if (serviceSelect) {
            serviceSelect.innerHTML = '<option value="">Seleccionar servicio</option>' +
                AppState.services.map(service => `
                    <option value="${service.id}">${service.name} - €${service.price}</option>
                `).join('');
        }
    },

    handleScheduleSubmit(form) {
        const formData = new FormData(form);
        const appointmentData = {
            id: Utils.generateId(),
            doctorId: parseInt(formData.get('doctor')),
            serviceId: parseInt(formData.get('service')),
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes'),
            status: 'pending'
        };

        // Validate
        if (!appointmentData.doctorId || !appointmentData.serviceId || !appointmentData.date || !appointmentData.time) {
            NotificationManager.error('Por favor completa todos los campos requeridos');
            return;
        }

        // Get doctor and service info
        const doctor = AppState.doctors.find(d => d.id === appointmentData.doctorId);
        const service = AppState.services.find(s => s.id === appointmentData.serviceId);

        if (!doctor || !service) {
            NotificationManager.error('Doctor o servicio no válido');
            return;
        }

        // Add additional info
        appointmentData.doctorName = doctor.name;
        appointmentData.specialty = doctor.specialtyName;
        appointmentData.location = `Consulta ${Math.floor(Math.random() * 300) + 100}`;

        // Add to appointments
        AppState.appointments.push(appointmentData);
        Storage.set('appointments', AppState.appointments);

        // Show success message
        NotificationManager.success('Cita agendada exitosamente');

        // Reset form and close modal
        form.reset();
        ModalManager.close();

        // Refresh appointments view
        this.renderUpcomingAppointments();
    },

    confirmAppointment(appointmentId) {
        const appointment = AppState.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            appointment.status = 'confirmed';
            Storage.set('appointments', AppState.appointments);
            NotificationManager.success('Cita confirmada exitosamente');
            this.renderUpcomingAppointments();
        }
    },

    rescheduleAppointment(appointmentId) {
        NotificationManager.info('Funcionalidad de reprogramación en desarrollo');
    },

    cancelAppointment(appointmentId) {
        if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
            const appointment = AppState.appointments.find(apt => apt.id === appointmentId);
            if (appointment) {
                appointment.status = 'cancelled';
                Storage.set('appointments', AppState.appointments);
                NotificationManager.success('Cita cancelada exitosamente');
                this.renderUpcomingAppointments();
                this.renderHistoryAppointments();
            }
        }
    },

    viewDetails(appointmentId) {
        const appointment = AppState.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            NotificationManager.info(`Detalles de la cita: ${appointment.doctorName} - ${Utils.formatDate(appointment.date)} a las ${appointment.time}`);
        }
    },

    bookAgain(appointmentId) {
        const appointment = AppState.appointments.find(apt => apt.id === appointmentId);
        if (appointment) {
            // Pre-fill schedule form with same doctor
            const doctorSelect = document.getElementById('doctor-select');
            if (doctorSelect) {
                doctorSelect.value = appointment.doctorId;
            }
            ModalManager.open('schedule-modal');
        }
    },

    downloadPrescription(prescriptionId) {
        NotificationManager.info('Descarga de receta iniciada');
    },

    getStatusText(status) {
        const statusTexts = {
            pending: 'Pendiente',
            confirmed: 'Confirmada',
            completed: 'Completada',
            cancelled: 'Cancelada'
        };
        return statusTexts[status] || status;
    }
};

// Schedule Wizard Manager
const ScheduleWizardManager = {
    currentStep: 1,
    selectedDoctor: null,
    selectedDate: null,
    selectedTime: null,

    init() {
        this.initWizardNavigation();
        this.renderDoctorSelection();
        this.initCalendar();
    },

    initWizardNavigation() {
        const nextBtn = document.getElementById('wizard-next');
        const prevBtn = document.getElementById('wizard-prev');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextStep());
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevStep());
        }
    },

    nextStep() {
        if (this.currentStep === 1 && !this.selectedDoctor) {
            NotificationManager.warning('Por favor selecciona un especialista');
            return;
        }

        if (this.currentStep === 2 && (!this.selectedDate || !this.selectedTime)) {
            NotificationManager.warning('Por favor selecciona fecha y hora');
            return;
        }

        if (this.currentStep < 3) {
            this.currentStep++;
            this.updateWizardStep();
        } else {
            this.completeBooking();
        }
    },

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateWizardStep();
        }
    },

    updateWizardStep() {
        // Update step indicators
        const steps = document.querySelectorAll('.step');
        const wizardSteps = document.querySelectorAll('.wizard-step');
        const nextBtn = document.getElementById('wizard-next');
        const prevBtn = document.getElementById('wizard-prev');

        steps.forEach((step, index) => {
            step.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                step.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });

        wizardSteps.forEach((step, index) => {
            step.classList.remove('active');
            if (index + 1 === this.currentStep) {
                step.classList.add('active');
            }
        });

        // Update navigation buttons
        if (prevBtn) {
            prevBtn.style.display = this.currentStep > 1 ? 'block' : 'none';
        }

        if (nextBtn) {
            if (this.currentStep === 3) {
                nextBtn.innerHTML = '<i class="fas fa-check"></i> Confirmar Cita';
            } else {
                nextBtn.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
            }
        }

        // Load step content
        if (this.currentStep === 2) {
            this.renderTimeSlots();
        } else if (this.currentStep === 3) {
            this.renderSummary();
        }
    },

    renderDoctorSelection() {
        const container = document.getElementById('doctors-selection');
        if (!container) return;

        container.innerHTML = AppState.doctors.map(doctor => `
            <div class="doctor-selection-card" data-doctor-id="${doctor.id}">
                <div class="doctor-avatar">${doctor.avatar}</div>
                <h4>${doctor.name}</h4>
                <div class="doctor-specialty">${doctor.specialtyName}</div>
                <div class="doctor-rating">
                    <div class="stars">
                        ${DoctorsManager.generateStars(doctor.rating)}
                    </div>
                    <span class="rating-text">${doctor.rating}</span>
                </div>
                <div class="doctor-availability">
                    <div class="availability-indicator ${doctor.availability === 'busy' ? 'busy' : ''}"></div>
                    <span>${doctor.availability === 'available' ? 'Disponible' : 'Ocupado'}</span>
                </div>
            </div>
        `).join('');

        // Add click handlers
        container.addEventListener('click', (e) => {
            const card = e.target.closest('.doctor-selection-card');
            if (card) {
                const doctorId = parseInt(card.getAttribute('data-doctor-id'));
                this.selectDoctor(doctorId);
            }
        });
    },

    selectDoctor(doctorId) {
        this.selectedDoctor = AppState.doctors.find(d => d.id === doctorId);
        
        // Update UI
        const cards = document.querySelectorAll('.doctor-selection-card');
        cards.forEach(card => {
            card.classList.remove('selected');
            if (parseInt(card.getAttribute('data-doctor-id')) === doctorId) {
                card.classList.add('selected');
            }
        });
    },

    initCalendar() {
        const calendar = document.getElementById('calendar');
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        const monthTitle = document.getElementById('calendar-month');

        if (!calendar) return;

        let currentDate = new Date();

        const renderCalendar = () => {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            // Update month title
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            if (monthTitle) {
                monthTitle.textContent = `${monthNames[month]} ${year}`;
            }

            // Clear calendar
            calendar.innerHTML = '';

            // Add day headers
            const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            dayHeaders.forEach(day => {
                const dayHeader = document.createElement('div');
                dayHeader.className = 'calendar-day-header';
                dayHeader.textContent = day;
                calendar.appendChild(dayHeader);
            });

            // Get first day of month and number of days
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Add empty cells for days before month starts
            for (let i = 0; i < firstDay; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day';
                calendar.appendChild(emptyDay);
            }

            // Add days of month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayElement = document.createElement('div');
                dayElement.className = 'calendar-day';
                dayElement.textContent = day;

                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                
                if (Utils.isDateAvailable(dateStr)) {
                    dayElement.classList.add('available');
                    dayElement.addEventListener('click', () => this.selectDate(dateStr));
                } else {
                    dayElement.classList.add('disabled');
                }

                calendar.appendChild(dayElement);
            }
        };

        // Navigation event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
        }

        // Initial render
        renderCalendar();
    },

    selectDate(dateStr) {
        this.selectedDate = dateStr;
        
        // Update UI
        const days = document.querySelectorAll('.calendar-day.available');
        days.forEach(day => {
            day.classList.remove('selected');
            if (day.textContent === new Date(dateStr).getDate().toString()) {
                day.classList.add('selected');
            }
        });

        this.renderTimeSlots();
    },

    renderTimeSlots() {
        const container = document.getElementById('time-slots');
        if (!container || !this.selectedDoctor || !this.selectedDate) return;

        const dayOfWeek = Utils.getDayOfWeek(this.selectedDate);
        const availableSlots = this.selectedDoctor.schedule[dayOfWeek] || [];

        container.innerHTML = availableSlots.map(time => `
            <div class="time-slot" data-time="${time}">
                ${time}
            </div>
        `).join('');

        // Add click handlers
        container.addEventListener('click', (e) => {
            const slot = e.target.closest('.time-slot');
            if (slot) {
                const time = slot.getAttribute('data-time');
                this.selectTime(time);
            }
        });
    },

    selectTime(time) {
        this.selectedTime = time;
        
        // Update UI
        const slots = document.querySelectorAll('.time-slot');
        slots.forEach(slot => {
            slot.classList.remove('selected');
            if (slot.getAttribute('data-time') === time) {
                slot.classList.add('selected');
            }
        });
    },

    renderSummary() {
        const container = document.getElementById('appointment-summary');
        if (!container) return;

        container.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Especialista:</span>
                <span class="summary-value">${this.selectedDoctor.name}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Especialidad:</span>
                <span class="summary-value">${this.selectedDoctor.specialtyName}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Fecha:</span>
                <span class="summary-value">${Utils.formatDate(this.selectedDate)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Hora:</span>
                <span class="summary-value">${this.selectedTime}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Duración estimada:</span>
                <span class="summary-value">30 minutos</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Costo:</span>
                <span class="summary-value">€65</span>
            </div>
        `;
    },

    completeBooking() {
        const appointmentData = {
            id: Utils.generateId(),
            doctorId: this.selectedDoctor.id,
            doctorName: this.selectedDoctor.name,
            specialty: this.selectedDoctor.specialtyName,
            date: this.selectedDate,
            time: this.selectedTime,
            status: 'pending',
            notes: 'Cita agendada desde el asistente',
            location: `Consulta ${Math.floor(Math.random() * 300) + 100}`
        };

        // Add to appointments
        AppState.appointments.push(appointmentData);
        Storage.set('appointments', AppState.appointments);

        // Show success message
        NotificationManager.success('¡Cita agendada exitosamente!');

        // Close modal and reset wizard
        ModalManager.close();
        this.resetWizard();

        // Refresh appointments view
        AppointmentsManager.renderUpcomingAppointments();
    },

    resetWizard() {
        this.currentStep = 1;
        this.selectedDoctor = null;
        this.selectedDate = null;
        this.selectedTime = null;
        this.updateWizardStep();
    }
};

// Form Handlers
const FormHandlers = {
    init() {
        this.initContactForm();
        this.initAuthForms();
    },

    initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactSubmit(e.target);
            });
        }
    },

    initAuthForms() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLoginSubmit(e.target);
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegisterSubmit(e.target);
            });
        }
    },

    handleContactSubmit(form) {
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate
        if (!contactData.name || !contactData.email || !contactData.subject || !contactData.message) {
            NotificationManager.error('Por favor completa todos los campos requeridos');
            return;
        }

        if (!Utils.validateEmail(contactData.email)) {
            NotificationManager.error('Por favor ingresa un email válido');
            return;
        }

        // Simulate sending
        LoadingManager.show('Enviando mensaje...');
        
        setTimeout(() => {
            LoadingManager.hide();
            NotificationManager.success('Mensaje enviado exitosamente. Te contactaremos pronto.');
            form.reset();
        }, 2000);
    },

    handleLoginSubmit(form) {
        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember')
        };

        // Validate
        if (!loginData.email || !loginData.password) {
            NotificationManager.error('Por favor completa todos los campos');
            return;
        }

        if (!Utils.validateEmail(loginData.email)) {
            NotificationManager.error('Por favor ingresa un email válido');
            return;
        }

        // Simulate login
        LoadingManager.show('Iniciando sesión...');
        
        setTimeout(() => {
            LoadingManager.hide();
            
            // Simulate successful login
            AppState.currentUser = {
                id: 1,
                name: 'Usuario Demo',
                email: loginData.email
            };
            
            Storage.set('currentUser', AppState.currentUser);
            NotificationManager.success('Sesión iniciada exitosamente');
            ModalManager.close();
            this.updateUserInterface();
        }, 2000);
    },

    handleRegisterSubmit(form) {
        const formData = new FormData(form);
        const registerData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            birthdate: formData.get('birthdate'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirm-password'),
            terms: formData.get('terms')
        };

        // Validate
        if (!registerData.name || !registerData.email || !registerData.phone || 
            !registerData.birthdate || !registerData.password || !registerData.confirmPassword) {
            NotificationManager.error('Por favor completa todos los campos');
            return;
        }

        if (!Utils.validateEmail(registerData.email)) {
            NotificationManager.error('Por favor ingresa un email válido');
            return;
        }

        if (!Utils.validatePhone(registerData.phone)) {
            NotificationManager.error('Por favor ingresa un teléfono válido');
            return;
        }

        if (registerData.password !== registerData.confirmPassword) {
            NotificationManager.error('Las contraseñas no coinciden');
            return;
        }

        if (registerData.password.length < 6) {
            NotificationManager.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!registerData.terms) {
            NotificationManager.error('Debes aceptar los términos y condiciones');
            return;
        }

        // Simulate registration
        LoadingManager.show('Creando cuenta...');
        
        setTimeout(() => {
            LoadingManager.hide();
            NotificationManager.success('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
            form.reset();
            ModalManager.close();
            ModalManager.open('login-modal');
        }, 2000);
    },

    updateUserInterface() {
        // Update UI based on user login status
        const loginBtn = document.querySelector('[data-modal="login-modal"]');
        const registerBtn = document.querySelector('[data-modal="register-modal"]');
        
        if (AppState.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (registerBtn) registerBtn.style.display = 'none';
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (registerBtn) registerBtn.style.display = 'inline-block';
        }
    }
};

// Main Application
const App = {
    init() {
        // Initialize all managers
        NotificationManager.init();
        LoadingManager.init();
        ModalManager.init();
        ServicesManager.init();
        DoctorsManager.init();
        AppointmentsManager.init();
        ScheduleWizardManager.init();
        FormHandlers.init();
        
        // Initialize navigation
        this.initNavigation();
        this.initScrollEffects();
        this.initAnimations();
        
        // Load user data
        this.loadUserData();
        
        console.log(`${CONFIG.APP_NAME} v${CONFIG.VERSION} initialized successfully`);
    },

    initNavigation() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    if (navMenu) navMenu.classList.remove('active');
                    if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
                }
            });
        });
    },

    initScrollEffects() {
        const header = document.querySelector('.header');
        
        if (header) {
            window.addEventListener('scroll', Utils.debounce(() => {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, 10));
        }
    },

    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    },

    loadUserData() {
        // Load user from storage
        AppState.currentUser = Storage.get('currentUser');
        FormHandlers.updateUserInterface();
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for global access
window.MediCitasApp = {
    AppState,
    Utils,
    Storage,
    NotificationManager,
    LoadingManager,
    ModalManager,
    ServicesManager,
    DoctorsManager,
    AppointmentsManager,
    ScheduleWizardManager,
    FormHandlers,
    App
};