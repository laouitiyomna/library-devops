import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService } from '../services/api.service';
import { Loan } from '../models';
import { ToastService, today } from '../ui';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="head"><div><h1>Tableau de bord</h1><p class="sub">Vue d'ensemble de la bibliothèque</p></div></header>

    <section class="stats">
      <div class="stat"><b>{{ titles }}</b><span>titres au catalogue</span></div>
      <div class="stat"><b>{{ available }}<small> / {{ copies }}</small></b><span>exemplaires disponibles</span></div>
      <div class="stat"><b>{{ active.length }}</b><span>emprunts en cours</span></div>
      <div class="stat" [class.alert]="late.length > 0"><b>{{ late.length }}</b><span>retours en retard</span></div>
    </section>

    <div class="two">
      <section class="panel">
        <h2>Retours en retard</h2>
        @for (l of late; track l.id) {
          <div class="row"><div><strong>{{ l.book.title }}</strong><small>{{ l.reader.name }}</small></div><span class="tag late">dû le {{ l.dueDate }}</span></div>
        } @empty { <p class="muted">Aucun retard. Tous les livres sont à jour.</p> }
      </section>
      <section class="panel">
        <h2>Derniers emprunts</h2>
        @for (l of recent; track l.id) {
          <div class="row"><div><strong>{{ l.book.title }}</strong><small>{{ l.reader.name }}</small></div><span class="tag" [class.done]="l.returnDate">{{ l.returnDate ? 'retourné' : 'à rendre le ' + l.dueDate }}</span></div>
        } @empty { <p class="muted">Aucun emprunt pour l'instant. <a routerLink="/loans">Enregistrer un emprunt</a></p> }
      </section>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  titles = 0; copies = 0; available = 0;
  active: Loan[] = []; late: Loan[] = []; recent: Loan[] = [];

  constructor(private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    forkJoin({ books: this.api.getBooks(), loans: this.api.getLoans(false) }).subscribe({
      next: ({ books, loans }) => {
        this.titles = books.length;
        this.copies = books.reduce((s, b) => s + b.totalCopies, 0);
        this.available = books.reduce((s, b) => s + (b.availableCopies ?? 0), 0);
        this.active = loans.filter(l => !l.returnDate);
        this.late = this.active.filter(l => l.dueDate < today());
        this.recent = [...loans].sort((a, b) => b.id - a.id).slice(0, 6);
      },
      error: e => this.toast.error(e)
    });
  }
}
