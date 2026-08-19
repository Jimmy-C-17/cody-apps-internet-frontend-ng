import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  private _cartItems = signal<CartItem[]>([]);
  public cartItems = this._cartItems.asReadonly();

  loadCart() {
    this.http.get<CartItem[]>(this.apiUrl).subscribe({
      next: (items) => this._cartItems.set(items),
      error: (err) => console.error('Error al cargar carrito', err)
    });
  }

  addToCart(productId: number, quantity: number = 1) {
    const body = {
      product_id: productId,
      quantity: quantity
    };
    this.http.post<CartItem>(this.apiUrl, body).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => console.error('Error al agregar al carrito', err)
    });
  }

  deleteCartItem(cartItemId: number) {
    this.http.delete(`${this.apiUrl}/${cartItemId}`).subscribe({
      next: () => {
        this.loadCart();
      },
      error: (err) => console.error('Error al eliminar item del carrito', err)
    });
  }
}
