const BASE_PRICE_PER_PAGE = 280;
const MAINTENANCE = 0;

const formatCurrency = (n) => n.toLocaleString('es-ES');

const getDeliveryWeeks = (pages, featureCount) => {
    const weeks = 2 + Math.ceil(pages / 3) + Math.floor(featureCount / 2);
    return weeks <= 3 ? '2-3 semanas' : weeks <= 5 ? '3-4 semanas' : `${weeks - 1}-${weeks} semanas`;
};

const calculate = () => {
    const pages = parseInt(document.getElementById('pagesSlider').value, 10);
    const basePrice = pages * BASE_PRICE_PER_PAGE;

    const features = [];
    let featuresTotal = 0;
    document.querySelectorAll('#featuresList input:checked').forEach((input) => {
        const price = parseInt(input.dataset.price, 10);
        featuresTotal += price;
        features.push({ label: input.dataset.label, price });
    });

    const designExtra = parseInt(document.querySelector('input[name="design"]:checked').value, 10);
    const total = basePrice + featuresTotal + designExtra + MAINTENANCE;

    document.getElementById('pagesValue').textContent = pages;
    document.getElementById('pagesSlider').setAttribute('aria-valuenow', pages);
    document.getElementById('totalAmount').textContent = formatCurrency(total);
    document.getElementById('deliveryTime').textContent = getDeliveryWeeks(pages, features.length);

    const breakdown = document.getElementById('breakdown');
    let html = `<div class="breakdown-item"><span>Base (${pages} página${pages > 1 ? 's' : ''})</span><span>${formatCurrency(basePrice)} €</span></div>`;
    features.forEach((f) => {
        html += `<div class="breakdown-item"><span>${f.label}</span><span>+${formatCurrency(f.price)} €</span></div>`;
    });
    if (designExtra > 0) {
        html += `<div class="breakdown-item"><span>Diseño personalizado</span><span>+${formatCurrency(designExtra)} €</span></div>`;
    }
    breakdown.innerHTML = html;

    return { pages, features, designExtra, total, basePrice, featuresTotal };
};

const buildBudgetText = (data) => {
    const lines = [
        '=== PRESUPUESTO WEB ===',
        '',
        `Páginas: ${data.pages}`,
        `Base: ${formatCurrency(data.basePrice)} €`,
    ];
    data.features.forEach((f) => lines.push(`${f.label}: +${formatCurrency(f.price)} €`));
    if (data.designExtra > 0) lines.push(`Diseño personalizado: +${formatCurrency(data.designExtra)} €`);
    lines.push('', `TOTAL: ${formatCurrency(data.total)} € (IVA no incluido)`, '', 'Generado con WebQuote · alamia.es');
    return lines.join('\n');
};

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('pagesSlider');
    const copyBtn = document.getElementById('copyBtn');
    const feedback = document.getElementById('copyFeedback');

    slider.addEventListener('input', calculate);
    document.querySelectorAll('#featuresList input, input[name="design"]').forEach((el) => {
        el.addEventListener('change', calculate);
    });

    copyBtn.addEventListener('click', async () => {
        const features = [];
        document.querySelectorAll('#featuresList input:checked').forEach((input) => {
            features.push({ label: input.dataset.label, price: parseInt(input.dataset.price, 10) });
        });
        const fullText = buildBudgetText({ ...calculate(), features });

        try {
            await navigator.clipboard.writeText(fullText);
            feedback.hidden = false;
            setTimeout(() => { feedback.hidden = true; }, 2500);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = fullText;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            feedback.hidden = false;
            setTimeout(() => { feedback.hidden = true; }, 2500);
        }
    });

    calculate();
});
