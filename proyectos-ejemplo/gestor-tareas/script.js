const STORAGE_KEY = 'taskboard-tasks';

const PRIORITY_LABELS = { low: 'Baja', medium: 'Media', high: 'Alta' };

const defaultTasks = [
    { id: '1', title: 'Revisar diseño de homepage', desc: 'Validar mockups con el cliente', priority: 'high', status: 'todo' },
    { id: '2', title: 'Configurar dominio', desc: 'DNS y certificado SSL', priority: 'medium', status: 'todo' },
    { id: '3', title: 'Implementar formulario contacto', desc: 'Con validación y envío', priority: 'medium', status: 'progress' },
    { id: '4', title: 'Optimizar imágenes', desc: 'WebP y lazy loading', priority: 'low', status: 'progress' },
    { id: '5', title: 'Crear repositorio Git', desc: 'Inicializar proyecto en GitHub', priority: 'low', status: 'done' },
];

let tasks = [];
let draggedId = null;

const loadTasks = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        tasks = stored ? JSON.parse(stored) : [...defaultTasks];
    } catch {
        tasks = [...defaultTasks];
    }
};

const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const renderBoard = () => {
    const columns = { todo: [], progress: [], done: [] };
    tasks.forEach((t) => columns[t.status]?.push(t));

    Object.entries(columns).forEach(([status, list]) => {
        const body = document.querySelector(`[data-drop="${status}"]`);
        const count = document.querySelector(`[data-count="${status}"]`);
        if (!body) return;

        count.textContent = list.length;
        body.innerHTML = list.map(createTaskHTML).join('');
        bindTaskEvents(body);
    });
};

const createTaskHTML = (task) => `
    <article class="task-card priority-${task.priority}" draggable="true" data-id="${task.id}">
        <h4>${escapeHtml(task.title)}</h4>
        ${task.desc ? `<p>${escapeHtml(task.desc)}</p>` : ''}
        <div class="task-meta">
            <span class="priority-badge ${task.priority}">${PRIORITY_LABELS[task.priority]}</span>
            <button type="button" class="task-delete" aria-label="Eliminar tarea" data-delete="${task.id}"><i class="fas fa-trash-alt"></i></button>
        </div>
    </article>
`;

const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

const bindTaskEvents = (container) => {
    container.querySelectorAll('.task-card').forEach((card) => {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    container.querySelectorAll('[data-delete]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            tasks = tasks.filter((t) => t.id !== btn.dataset.delete);
            saveTasks();
            renderBoard();
        });
    });
};

const handleDragStart = (e) => {
    draggedId = e.currentTarget.dataset.id;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
};

const handleDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.column-body').forEach((col) => col.classList.remove('drag-over'));
};

const initDragDrop = () => {
    document.querySelectorAll('.column-body').forEach((col) => {
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            col.classList.add('drag-over');
        });
        col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            col.classList.remove('drag-over');
            const status = col.dataset.drop;
            const task = tasks.find((t) => t.id === draggedId);
            if (task) {
                task.status = status;
                saveTasks();
                renderBoard();
            }
        });
    });
};

const initModal = () => {
    const modal = document.getElementById('taskModal');
    const form = document.getElementById('taskForm');
    const openBtn = document.getElementById('addTaskBtn');

    const openModal = () => {
        modal.hidden = false;
        document.getElementById('taskTitle').focus();
    };

    const closeModal = () => {
        modal.hidden = true;
        form.reset();
    };

    openBtn.addEventListener('click', openModal);
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.modal-cancel').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('taskTitle').value.trim();
        if (!title) return;

        tasks.push({
            id: generateId(),
            title,
            desc: document.getElementById('taskDesc').value.trim(),
            priority: document.getElementById('taskPriority').value,
            status: 'todo',
        });
        saveTasks();
        renderBoard();
        closeModal();
    });
};

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderBoard();
    initDragDrop();
    initModal();
});
