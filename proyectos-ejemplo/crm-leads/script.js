const STORAGE_KEY = 'leadflow-leads';

const STAGES = [
    { id: 'new', label: 'Nuevo' },
    { id: 'contact', label: 'Contactado' },
    { id: 'proposal', label: 'Propuesta' },
    { id: 'negotiation', label: 'Negociación' },
    { id: 'won', label: 'Ganado' },
];

const SOURCE_LABELS = { web: 'Web', linkedin: 'LinkedIn', referido: 'Referido', evento: 'Evento' };

const defaultLeads = [
    { id: '1', name: 'Carlos Ruiz', company: 'InnovaTech', email: 'carlos@innovatech.es', source: 'web', value: 12000, stage: 'new' },
    { id: '2', name: 'Laura Méndez', company: 'Digital Plus', email: 'laura@digitalplus.com', source: 'linkedin', value: 8500, stage: 'new' },
    { id: '3', name: 'Miguel Santos', company: 'Grupo Nexus', email: 'm.santos@nexus.io', source: 'referido', value: 25000, stage: 'contact' },
    { id: '4', name: 'Elena Vargas', company: 'StartupLab', email: 'elena@startuplab.co', source: 'evento', value: 6000, stage: 'contact' },
    { id: '5', name: 'Pablo Herrera', company: 'MediaFlow', email: 'pablo@mediaflow.es', source: 'web', value: 15000, stage: 'proposal' },
    { id: '6', name: 'Sofía Castro', company: 'EcoMarket', email: 'sofia@ecomarket.com', source: 'linkedin', value: 9000, stage: 'negotiation' },
    { id: '7', name: 'David Ortega', company: 'FinApp SL', email: 'david@finapp.es', source: 'referido', value: 32000, stage: 'won' },
];

let leads = [];
let draggedId = null;
let sourceFilter = 'all';

const loadLeads = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        leads = stored ? JSON.parse(stored) : [...defaultLeads];
    } catch {
        leads = [...defaultLeads];
    }
};

const saveLeads = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const formatValue = (n) => n.toLocaleString('es-ES') + ' €';

const renderPipeline = () => {
    const pipeline = document.getElementById('pipeline');
    pipeline.innerHTML = STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.stage === stage.id);
        const visibleCount = stageLeads.filter((l) => sourceFilter === 'all' || l.source === sourceFilter).length;

        return `
            <div class="stage" data-stage="${stage.id}">
                <div class="stage-header">
                    <h2><span class="stage-dot"></span>${stage.label}</h2>
                    <span class="stage-count">${visibleCount}</span>
                </div>
                <div class="stage-body" data-drop="${stage.id}">
                    ${stageLeads.map(createLeadHTML).join('')}
                </div>
            </div>
        `;
    }).join('');

    bindEvents();
};

const createLeadHTML = (lead) => {
    const hidden = sourceFilter !== 'all' && lead.source !== sourceFilter;
    return `
        <article class="lead-card ${hidden ? 'hidden' : ''}" draggable="true" data-id="${lead.id}">
            <h4>${escapeHtml(lead.name)}</h4>
            <p class="lead-company">${escapeHtml(lead.company)}</p>
            <div class="lead-meta">
                <span class="lead-value">${formatValue(lead.value)}</span>
                <span class="source-badge ${lead.source}">${SOURCE_LABELS[lead.source]}</span>
            </div>
            <button type="button" class="lead-delete" data-delete="${lead.id}">Eliminar</button>
        </article>
    `;
};

const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

const bindEvents = () => {
    document.querySelectorAll('.lead-card').forEach((card) => {
        card.addEventListener('dragstart', (e) => {
            draggedId = card.dataset.id;
            card.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });

    document.querySelectorAll('[data-delete]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            leads = leads.filter((l) => l.id !== btn.dataset.delete);
            saveLeads();
            renderPipeline();
        });
    });

    document.querySelectorAll('.stage-body').forEach((col) => {
        col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
        col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('drag-over');
            const lead = leads.find((l) => l.id === draggedId);
            if (lead) {
                lead.stage = col.dataset.drop;
                saveLeads();
                renderPipeline();
            }
        });
    });
};

const initModal = () => {
    const modal = document.getElementById('leadModal');
    const form = document.getElementById('leadForm');

    const open = () => { modal.hidden = false; document.getElementById('leadName').focus(); };
    const close = () => { modal.hidden = true; form.reset(); };

    document.getElementById('addLeadBtn').addEventListener('click', open);
    modal.querySelector('.modal-close').addEventListener('click', close);
    modal.querySelector('.modal-cancel').addEventListener('click', close);
    modal.addEventListener('click', (e) => { if (e.target === modal) close(); });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        leads.push({
            id: generateId(),
            name: document.getElementById('leadName').value.trim(),
            company: document.getElementById('leadCompany').value.trim(),
            email: document.getElementById('leadEmail').value.trim(),
            source: document.getElementById('leadSource').value,
            value: parseInt(document.getElementById('leadValue').value, 10),
            stage: 'new',
        });
        saveLeads();
        renderPipeline();
        close();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadLeads();
    renderPipeline();
    initModal();

    document.getElementById('sourceFilter').addEventListener('change', (e) => {
        sourceFilter = e.target.value;
        renderPipeline();
    });
});
