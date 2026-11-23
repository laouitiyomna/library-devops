import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Reader } from '../models';
import { ToastService, initials, tone } from '../ui';

@Component({
  selector: 'app-readers',
  standalone: true,
  imports: [FormsModule],
  template: `
    <header class="head">
      <div><h1>Lecteurs</h1><p class="sub">{{ readers.length }} inscrit(s)</p></div>
      <button class="btn" (click)="open()">Ajouter un lecteur</button>
    </header>

    <div class="panel flush">
      <div class="tools"><input class="search" [(ngModel)]="q" (ngModelChange)="load()" placeholder="Rechercher un nom ou un e-mail"></div>
      <table>
        <thead><tr><th>Lecteur</th><th>Téléphone</th><th></th></tr></thead>
        <tbody>
          @for (r of readers; track r.id) {
            <tr>
              <td><div class="cell"><span class="avatar" [style.background]="tone(r.name)">{{ initials(r.name) }}</span><div><strong>{{ r.name }}</strong><small>{{ r.email }}</small></div></div></td>
              <td class="muted">{{ r.phone || '-' }}</td>
              <td class="end"><button class="link" (click)="open(r)">Modifier</button><button class="link danger" (click)="remove(r)">Supprimer</button></td>
            </tr>
          } @empty {
            <tr><td colspan="3" class="empty">{{ q ? 'Aucun résultat pour cette recherche.' : 'Aucun lecteur inscrit. Ajoutez le premier.' }}</td></tr>
          }
        </tbody>
      </table>
    </div>

    @if (show) {
      <div class="overlay" (click)="show = false">
        <form class="modal" (click)="$event.stopPropagation()" (ngSubmit)="save()">
          <h2>{{ form.id ? 'Modifier le lecteur' : 'Nouveau lecteur' }}</h2>
          <label>Nom complet<input name="n" [(ngModel)]="form.name" required></label>
          <div class="cols two-c">
            <label>E-mail<input name="e" type="email" [(ngModel)]="form.email"></label>
            <label>Téléphone<input name="p" [(ngModel)]="form.phone"></label>
          </div>
          <div class="actions"><button type="button" class="btn ghost" (click)="show = false">Annuler</button><button class="btn">Enregistrer</button></div>
        </form>
      </div>
    }
  `
})
export class ReadersComponent implements OnInit {
  readers: Reader[] = []; q = ''; show = false; form: Reader = this.empty(); tone = tone; initials = initials;
  constructor(private api: ApiService, private toast: ToastService) {}
  ngOnInit() { this.load(); }
  empty(): Reader { return { name: '', email: '', phone: '' }; }
  load() { this.api.getReaders(this.q).subscribe({ next: r => (this.readers = r), error: e => this.toast.error(e) }); }
  open(r?: Reader) { this.form = r ? { ...r } : this.empty(); this.show = true; }
  save() {
    this.api.saveReader(this.form).subscribe({
      next: () => { this.toast.show('Lecteur enregistré'); this.show = false; this.load(); },
      error: e => this.toast.error(e)
    });
  }
  remove(r: Reader) {
    if (!confirm(`Supprimer ${r.name} ?`)) return;
    this.api.deleteReader(r.id!).subscribe({ next: () => { this.toast.show('Lecteur supprimé'); this.load(); }, error: e => this.toast.error(e) });
  }
}
