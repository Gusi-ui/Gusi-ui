export const isExternalDemo = (demoUrl: string): boolean =>
  demoUrl.startsWith('http://') || demoUrl.startsWith('https://');

export const getProjectDemoLabel = (demoUrl: string): string =>
  isExternalDemo(demoUrl) ? 'En vivo' : 'Demo';

export const getDemoHref = (demoUrl: string): string => demoUrl;
