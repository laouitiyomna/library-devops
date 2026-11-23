export interface Book {
  id?: number;
  title: string;
  author: string;
  isbn: string;
  publicationYear?: number | null;
  totalCopies: number;
  availableCopies?: number;
}

export interface Reader {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface Loan {
  id: number;
  book: Book;
  reader: Reader;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
}
