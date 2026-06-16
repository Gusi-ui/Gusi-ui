document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollButtons();
    initBillingToggle();
    initAccordion();
    initTrialForm();
});

const initMobileMenu = () => {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
};

const initScrollButtons = () => {
    document.querySelectorAll('[data-scroll]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.scroll);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
};

const initBillingToggle = () => {
    const toggle = document.getElementById('billingToggle');
    const amounts = document.querySelectorAll('.amount[data-monthly]');
    const labels = document.querySelectorAll('.billing-label');
    if (!toggle) return;

    const updatePricing = (isAnnual) => {
        toggle.setAttribute('aria-checked', String(isAnnual));
        labels.forEach((label) => {
            label.classList.toggle('active', label.dataset.period === (isAnnual ? 'annual' : 'monthly'));
        });
        amounts.forEach((el) => {
            const price = isAnnual ? el.dataset.annual : el.dataset.monthly;
            el.textContent = price;
        });
    };

    toggle.addEventListener('click', () => {
        const isAnnual = toggle.getAttribute('aria-checked') !== 'true';
        updatePricing(isAnnual);
    });

    updatePricing(false);
};

const initAccordion = () => {
    document.querySelectorAll('.accordion-trigger').forEach((trigger) => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const isOpen = item.classList.contains('open');

            document.querySelectorAll('.accordion-item').forEach((i) => {
                i.classList.remove('open');
                i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
};

const initTrialForm = () => {
    const form = document.getElementById('trialForm');
    if (!form) return;

    const fields = {
        name: { el: document.getElementById('name'), error: document.getElementById('nameError'), validate: (v) => v.trim().length >= 2 || 'Introduce tu nombre (mín. 2 caracteres)' },
        email: { el: document.getElementById('email'), error: document.getElementById('emailError'), validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Introduce un email válido' },
        company: { el: document.getElementById('company'), error: document.getElementById('companyError'), validate: (v) => v.trim().length >= 2 || 'Introduce el nombre de tu empresa' },
        terms: { el: document.getElementById('terms'), error: document.getElementById('termsError'), validate: (v) => v || 'Debes aceptar los términos' },
    };

    const validateField = (key) => {
        const { el, error, validate } = fields[key];
        const value = el.type === 'checkbox' ? el.checked : el.value;
        const result = validate(value);
        if (result === true) {
            el.classList.remove('invalid');
            error.textContent = '';
            return true;
        }
        el.classList.add('invalid');
        error.textContent = result;
        return false;
    };

    Object.keys(fields).forEach((key) => {
        fields[key].el.addEventListener('blur', () => validateField(key));
        fields[key].el.addEventListener('input', () => {
            if (fields[key].el.classList.contains('invalid')) validateField(key);
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const success = document.getElementById('formSuccess');
        success.hidden = true;

        const isValid = Object.keys(fields).every(validateField);
        if (!isValid) return;

        form.querySelector('button[type="submit"]').disabled = true;
        success.hidden = false;
        form.reset();
        setTimeout(() => {
            form.querySelector('button[type="submit"]').disabled = false;
        }, 3000);
    });
};
