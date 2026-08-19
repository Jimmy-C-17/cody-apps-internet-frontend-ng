import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Review } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  private _reviews = signal<Review[]>([]);
  public reviews = this._reviews.asReadonly();

  loadReviews(productId: number) {
    this.http.get<Review[]>(`${this.baseUrl}/${productId}/reviews`).subscribe({
      next: (data) => this._reviews.set(data),
      error: (err) => {
        console.error('Error al cargar reseñas', err);
        this._reviews.set([]);
      }
    });
  }

  createReview(productId: number, rating: number, comment: string) {
    const payload = { rating, comment };
    this.http.post<Review>(`${this.baseUrl}/${productId}/reviews`, payload).subscribe({
      next: (newReview) => {
        // Actualización reactiva e instantánea usando Signals
        this._reviews.update((current) => [...current, newReview]);
      },
      error: (err) => console.error('Error al crear reseña', err)
    });
  }

  clearReviews() {
    this._reviews.set([]);
  }
}
