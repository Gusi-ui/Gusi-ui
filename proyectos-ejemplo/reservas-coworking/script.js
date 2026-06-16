const STORAGE_KEY = 'cowork-bookings';
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const SPACE_LABELS = { desk: 'Mesa individual', meeting: 'Sala de reuniones' };
const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

let bookings = [];
let selectedSpace = 'desk';
let selectedPrice = 15;
let selectedDate = null;
let selectedTime = null;

const loadBookings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        bookings = stored ? JSON.parse(stored) : [];
    } catch {
        bookings = [];
    }
};

const saveBookings = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

const getNext7Days = () => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        days.push(d);
    }
    return days;
};

const formatDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const isSlotBooked = (dateKey, time, space) => {
    return bookings.some((b) => b.date === dateKey && b.time === time && b.space === space);
};

const renderDates = () => {
    const picker = document.getElementById('datePicker');
    const days = getNext7Days();

    picker.innerHTML = days.map((date, i) => {
        const key = formatDateKey(date);
        return `
            <button type="button" class="date-btn ${i === 0 ? 'active' : ''}" data-date="${key}">
                <span class="day-name">${DAY_NAMES[date.getDay()]}</span>
                <span class="day-num">${date.getDate()}</span>
                <span class="day-month">${MONTH_NAMES[date.getMonth()]}</span>
            </button>
        `;
    }).join('');

    selectedDate = formatDateKey(days[0]);

    picker.querySelectorAll('.date-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            picker.querySelectorAll('.date-btn').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            selectedDate = btn.dataset.date;
            selectedTime = null;
            renderTimeSlots();
            updateSummary();
            updateConfirmButton();
        });
    });

    renderTimeSlots();
};

const renderTimeSlots = () => {
    const container = document.getElementById('timeSlots');
    const hint = document.getElementById('slotsHint');

    if (!selectedDate) {
        container.innerHTML = '';
        hint.hidden = false;
        return;
    }

    hint.hidden = true;
    container.innerHTML = TIME_SLOTS.map((time) => {
        const booked = isSlotBooked(selectedDate, time, selectedSpace);
        const active = selectedTime === time && !booked;
        return `
            <button type="button"
                class="time-slot ${booked ? 'booked' : ''} ${active ? 'active' : ''}"
                data-time="${time}"
                ${booked ? 'disabled' : ''}
                aria-label="${booked ? `${time} no disponible` : `Reservar a las ${time}`}">
                ${time}
            </button>
        `;
    }).join('');

    container.querySelectorAll('.time-slot:not(.booked)').forEach((btn) => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.time-slot').forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            selectedTime = btn.dataset.time;
            updateSummary();
            updateConfirmButton();
        });
    });
};

const initSpaceSelection = () => {
    document.querySelectorAll('.space-card').forEach((card) => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.space-card').forEach((c) => c.classList.remove('active'));
            card.classList.add('active');
            selectedSpace = card.dataset.space;
            selectedPrice = parseInt(card.dataset.price, 10);
            selectedTime = null;
            renderTimeSlots();
            updateSummary();
            updateConfirmButton();
        });
    });
};

const updateSummary = () => {
    document.getElementById('sumSpace').textContent = SPACE_LABELS[selectedSpace];
    document.getElementById('sumDate').textContent = selectedDate
        ? selectedDate.split('-').reverse().join('/')
        : '—';
    document.getElementById('sumTime').textContent = selectedTime || '—';
    document.getElementById('sumTotal').textContent = selectedTime ? `${selectedPrice} €` : '—';
};

const updateConfirmButton = () => {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const valid = selectedDate && selectedTime && name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    document.getElementById('confirmBooking').disabled = !valid;
};

const confirmBooking = () => {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();

    if (isSlotBooked(selectedDate, selectedTime, selectedSpace)) {
        alert('Este horario ya no está disponible. Selecciona otro.');
        renderTimeSlots();
        return;
    }

    const booking = {
        id: Date.now().toString(36),
        space: selectedSpace,
        date: selectedDate,
        time: selectedTime,
        price: selectedPrice,
        name,
        email,
        createdAt: new Date().toISOString(),
    };

    bookings.push(booking);
    saveBookings();

    const conf = document.getElementById('confirmation');
    const confText = document.getElementById('confirmationText');
    confText.textContent = `${SPACE_LABELS[selectedSpace]} · ${selectedDate.split('-').reverse().join('/')} a las ${selectedTime} · ${selectedPrice} €`;
    conf.hidden = false;

    selectedTime = null;
    renderTimeSlots();
    updateSummary();
    updateConfirmButton();

    setTimeout(() => { conf.hidden = true; }, 5000);
};

const renderBookingsList = () => {
    const list = document.getElementById('bookingsList');
    if (!bookings.length) {
        list.innerHTML = '<p class="bookings-empty">No tienes reservas activas</p>';
        return;
    }

    list.innerHTML = [...bookings].reverse().map((b) => `
        <div class="booking-item">
            <h4>${SPACE_LABELS[b.space]} — ${b.price} €</h4>
            <p>${b.date.split('-').reverse().join('/')} · ${b.time}</p>
            <p>${b.name} · ${b.email}</p>
        </div>
    `).join('');
};

const initBookingsModal = () => {
    const modal = document.getElementById('bookingsModal');
    const open = () => { renderBookingsList(); modal.hidden = false; };
    const close = () => { modal.hidden = true; };

    document.getElementById('viewBookingsBtn').addEventListener('click', open);
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
};

document.addEventListener('DOMContentLoaded', () => {
    loadBookings();
    renderDates();
    initSpaceSelection();
    updateSummary();
    initBookingsModal();

    document.getElementById('userName').addEventListener('input', updateConfirmButton);
    document.getElementById('userEmail').addEventListener('input', updateConfirmButton);
    document.getElementById('confirmBooking').addEventListener('click', confirmBooking);
});
