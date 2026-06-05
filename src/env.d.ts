/// <reference types="astro/client" />

declare function gtag(...args: unknown[]): void;

interface Window {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
}
