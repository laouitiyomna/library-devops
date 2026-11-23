import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Book, Loan, Reader } from '../models';
import { ToastService, today } from '../ui';

type Filter = 'all' | 'active' | 'late' | 'done';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="head">
      <div><h1>Emprunts</h1><p class="sub">Prêts et retours</p></div>
      <button class="btn" (click)="show = true">Nouvel emprunt</button>
    </header>

    <div class="panel flush">
      <div class="tools tabs">
        @for (t of tabs; track t.key) {
          <button [class.on]="filter === t.key" (click)="filter = t.key">{{ t.label }} <span>{{ count(t.key) }}</span></button>
        }
      </div>
      <table>
        <thead><tr><th>Livre</th><th>Lecteur</th><th>Emprunté le</th><th>À rendre le</th><th>Statut</th><th></th></tr></thead>
        <tbody>
          @for (l of shown(); track l.id) {
            <tr>
              <td><strong>{{ l.book.title }}</strong></td>
              <td>{{ l.reader.name }}</td>
              <td class="muted">{{ l.loanDate }}</td>
              <td class="muted">{{ l.dueDate }}</td>
              <td>
                @if (l.returnDate) { <span class="tag done">Retourné le {{ l.returnDate }}</span> }
                @else if (isLate(l)) { <span class="tag late">En retard</span> }
                @else { <span class="tag">En cours</span> }
              </td>
              <td class="end">@if (!l.returnDate) { <button class="btn small" (click)="giveBack(l)">Enregistrer le retour</button> }</td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="empty">Aucun emprunt dans cette vue.</td></tr>
          }
        </tbody>
      </table>
    </div>

    @if (show) {
      <div class="overlay" (click)="show = false">
        <form class="modal" (click)="$event.stopPropagation()" (ngSubmit)="borrow()">
          <h2>Nouvel emprunt</h2>
          <label>Lecteur
            <select name="r" [(ngModel)]="readerId" required>
              <option [ngValue]="null" disabled>Choisir un lecteur</option>
              @for (r of readers; track r.id) { <option [ngValue]="r.id">{{ r.name }}</option> }
            </select>
          </label>
          <label>Livre disponible
            <select name="b" [(ngModel)]="bookId" required>
              <option [ngValue]="null" disabled>Choisir un livre</option>
              @for (b of books; track b.id) { <option [ngValue]="b.id">{{ b.title }} ({{ b.availableCopies }} dispo)</option> }
            </select>
          </label>
          <p class="muted">Durée du prêt : 14 jours.</p>
          <div class="actions"><button type="button" class="btn ghost" (click)="show = false">Annuler</button><button class="btn" [disabled]="!readerId || !bookId">Enregistrer l'emprunt</button></div>
        </form>
      </div>
    }
  `
})
export class LoansComponent implements OnInit {
  loans: Loan[] = []; readers: Reader[] = []; books: Book[] = [];
  readerId: number | null = null; bookId: number | null = null;
  show = false; filter: Filter = 'all';
  tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Tous' }, { key: 'active', label: 'En cours' }, { key: 'late', label: 'En retard' }, { key: 'done', label: 'Retournés' }
  ];
  constructor(private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.load(); }
  load() {
    this.api.getLoans(false).subscribe({ next: l => (this.loans = [...l].sort((a, b) => b.id - a.id)), error: e => this.toast.error(e) });
    this.api.getReaders().subscribe(r => (this.readers = r));
    this.api.getBooks().subscribe(b => (this.books = b.filter(x => (x.availableCopies ?? 0) > 0)));
  }
  isLate(l: Loan) { return !l.returnDate && l.dueDate < today(); }
  match(l: Loan, f: Filter) {
    return f === 'all' || (f === 'active' && !l.returnDate) || (f === 'late' && this.isLate(l)) || (f === 'done' && !!l.returnDate);
  }
  count(f: Filter) { return this.loans.filter(l => this.match(l, f)).length; }
  shown() { return this.loans.filter(l => this.match(l, this.filter)); }
  borrow() {
    this.api.borrow(this.bookId!, this.readerId!).subscribe({
      next: () => { this.toast.show('Emprunt enregistré'); this.show = false; this.bookId = null; this.load(); },
      error: e => this.toast.error(e)
    });
  }
  giveBack(l: Loan) {
    this.api.giveBack(l.id).subscribe({ next: () => { this.toast.show('Retour enregistré'); this.load(); }, error: e => this.toast.error(e) });
  }
}
