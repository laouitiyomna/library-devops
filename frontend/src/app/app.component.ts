import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastService } from './ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <aside class="side">
        <div class="brand"><span class="mark">B</span><span>Bibliothèque</span></div>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="on">Tableau de bord</a>
          <a routerLink="/books" routerLinkActive="on">Catalogue</a>
          <a routerLink="/readers" routerLinkActive="on">Lecteurs</a>
          <a routerLink="/loans" routerLinkActive="on">Emprunts</a>
        </nav>
      </aside>
      <main><router-outlet /></main>
    </div>
    <div class="toasts" aria-live="polite">
      @for (t of toast.toasts(); track t.id) { <div class="toast" [class.err]="t.type === 'err'">{{ t.text }}</div> }
    </div>
  `
})
export class AppComponent {
  constructor(public toast: ToastService) {}
}
