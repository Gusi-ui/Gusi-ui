import { describe, it, expect } from 'vitest';
import { pickVisibleProjects, type DisplayProject } from '../src/lib/projects-display';

const proyecto = (id: string, demoUrl: string, type: DisplayProject['type'] = 'web') =>
  ({ id, type, demoUrl }) as DisplayProject;

const vivos = ['a', 'b', 'c', 'd'].map((id) => proyecto(`vivo-${id}`, `https://${id}.com`));
const demos = Array.from({ length: 14 }, (_, i) =>
  proyecto(`demo-${i}`, `/proyectos-ejemplo/${i}/index.html`, i < 4 ? 'ecommerce' : 'web'),
);
const todos = [...demos, ...vivos];

const enVivo = (lista: DisplayProject[]) => lista.filter((p) => p.demoUrl.startsWith('https://'));

describe('pickVisibleProjects', () => {
  it('enseña al menos las webs en vivo pedidas, en cualquier tirada', () => {
    for (let i = 0; i < 200; i += 1) {
      const elegidos = pickVisibleProjects(todos, 'all', 3, 2);
      expect(elegidos).toHaveLength(3);
      expect(enVivo(elegidos).length).toBeGreaterThanOrEqual(2);
      expect(new Set(elegidos.map((p) => p.id)).size).toBe(3);
    }
  });

  it('no siempre pone las webs en vivo en las mismas posiciones', () => {
    const posiciones = new Set<number>();
    for (let i = 0; i < 200; i += 1) {
      pickVisibleProjects(todos, 'all', 3, 2).forEach((p, idx) => {
        if (p.demoUrl.startsWith('https://')) posiciones.add(idx);
      });
    }
    expect(posiciones.size).toBe(3);
  });

  it('rellena con demos si el filtro no tiene webs en vivo', () => {
    const elegidos = pickVisibleProjects(todos, 'ecommerce', 3, 2);
    expect(elegidos).toHaveLength(3);
    expect(elegidos.every((p) => p.type === 'ecommerce')).toBe(true);
  });

  it('sin mínimo se comporta como antes', () => {
    expect(pickVisibleProjects(todos, 'all', 3)).toHaveLength(3);
    expect(pickVisibleProjects(vivos, 'all', 10)).toHaveLength(4);
  });
});
