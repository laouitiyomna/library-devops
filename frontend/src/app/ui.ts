import { Injectable, signal } from '@angular/core';

/** Couleur stable à partir d'un texte (pour les couvertures et avatars). */
export function tone(s: string): string {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return `hsl(${h} 38% 36%)`;
}
export function initials(s: string): string {
  return s.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}
export function today(): string { return new Date().toISOString().substring(0, 10); }

export interface Toast { id: number; text: string; type: 'ok' | 'err'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);
  private n = 0;
  show(text: string, type: 'ok' | 'err' = 'ok') {
    const id = ++this.n;
    this.toasts.update(t => [...t, { id, text, type }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 3500);
  }
  error(e: any) { this.show(e?.error?.message || 'Le serveur ne répond pas. Vérifiez que le backend est lancé.', 'err'); }
}
