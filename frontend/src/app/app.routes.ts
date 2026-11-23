import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard.component';
import { BooksComponent } from './pages/books.component';
import { ReadersComponent } from './pages/readers.component';
import { LoansComponent } from './pages/loans.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'books', component: BooksComponent },
  { path: 'readers', component: ReadersComponent },
  { path: 'loans', component: LoansComponent },
  { path: '**', redirectTo: 'dashboard' }
];
