import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Book } from '../models';
import { ToastService, tone } from '../ui';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="head">
      <div><h1>Catalogue</h1><p class="sub">{{ books.length }} titre(s)</p></div>
      <button class="btn" (click)="open()">Ajouter un livre</button>
    </header>

    <div class="panel flush">
      <div class="tools"><input class="search" [(ngModel)]="q" (ngModelChange)="load()" placeholder="Rechercher un titre, un auteur ou un ISBN"></div>
      <table>
        <thead><tr><th>Livre</th><th>ISBN</th><th>Année</th><th>Disponibilité</th><th></th></tr></thead>
        <tbody>
          @for (b of books; track b.id) {
            <tr>
              <td><div class="cell"><span class="cover" [style.background]="tone(b.title)"></span><div><strong>{{ b.title }}</strong><small>{{ b.author }}</small></div></div></td>
              <td class="muted">{{ b.isbn || '-' }}</td>
              <td class="muted">{{ b.publicationYear || '-' }}</td>
              <td>
                <div class="meter"><i [style.width.%]="100 * (b.availableCopies ?? 0) / b.totalCopies" [class.low]="b.availableCopies === 0"></i></div>
                <small>{{ b.availableCopies }} sur {{ b.totalCopies }}</small>
              </td>
              <td class="end"><button class="link" (click)="open(b)">Modifier</button><button class="link danger" (click)="remove(b)">Supprimer</button></td>
            </tr>
          } @empty {
            <tr><td colspan="5" class="empty">{{ q ? 'Aucun résultat pour cette recherche.' : 'Le catalogue est vide. Ajoutez votre premier livre.' }}</td></tr>
          }
        </tbody>
      </table>
    </div>

    @if (show) {
      <div class="overlay" (click)="show = false">
        <form class="modal" (click)="$event.stopPropagation()" (ngSubmit)="save()">
          <h2>{{ form.id ? 'Modifier le livre' : 'Nouveau livre' }}</h2>
          <label>Titre<input name="t" [(ngModel)]="form.title" required></label>
          <label>Auteur<input name="a" [(ngModel)]="form.author" required></label>
          <div class="cols">
            <label>ISBN<input name="i" [(ngModel)]="form.isbn"></label>
            <label>Année<input name="y" type="number" [(ngModel)]="form.publicationYear"></label>
            <label>Exemplaires<input name="c" type="number" min="1" [(ngModel)]="form.totalCopies" required></label>
          </div>
          <div class="actions"><button type="button" class="btn ghost" (click)="show = false">Annuler</button><button class="btn">Enregistrer</button></div>
        </form>
      </div>
    }
  `
})
export class BooksComponent implements OnInit {
  books: Book[] = []; q = ''; show = false; form: Book = this.empty(); tone = tone;
  constructor(private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.load(); }
  empty(): Book { return { title: '', author: '', isbn: '', publicationYear: null, totalCopies: 1 }; }
  load() { this.api.getBooks(this.q).subscribe({ next: b => (this.books = b), error: e => this.toast.error(e) }); }
  open(b?: Book) { this.form = b ? { ...b } : this.empty(); this.show = true; }
  save() {
    this.api.saveBook(this.form).subscribe({
      next: () => { this.toast.show('Livre enregistré'); this.show = false; this.load(); },
      error: e => this.toast.error(e)
    });
  }
  remove(b: Book) {
    if (!confirm(`Supprimer « ${b.title} » ?`)) return;
    this.api.deleteBook(b.id!).subscribe({ next: () => { this.toast.show('Livre supprimé'); this.load(); }, error: e => this.toast.error(e) });
  }
}
