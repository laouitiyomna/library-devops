import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, Loan, Reader } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Livres
  getBooks(q = ''): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.base}/books`, { params: new HttpParams().set('q', q) });
  }
  saveBook(b: Book): Observable<Book> {
    return b.id ? this.http.put<Book>(`${this.base}/books/${b.id}`, b) : this.http.post<Book>(`${this.base}/books`, b);
  }
  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/books/${id}`);
  }

  // Lecteurs
  getReaders(q = ''): Observable<Reader[]> {
    return this.http.get<Reader[]>(`${this.base}/readers`, { params: new HttpParams().set('q', q) });
  }
  saveReader(r: Reader): Observable<Reader> {
    return r.id ? this.http.put<Reader>(`${this.base}/readers/${r.id}`, r) : this.http.post<Reader>(`${this.base}/readers`, r);
  }
  deleteReader(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/readers/${id}`);
  }

  // Emprunts
  getLoans(active: boolean): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.base}/loans`, { params: new HttpParams().set('active', active) });
  }
  borrow(bookId: number, readerId: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.base}/loans`, { bookId, readerId });
  }
  giveBack(id: number): Observable<Loan> {
    return this.http.put<Loan>(`${this.base}/loans/${id}/return`, {});
  }
}
