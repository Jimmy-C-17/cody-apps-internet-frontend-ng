import { Component, OnInit, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-gray-800 dark:text-white">Productos Disponibles</h2>
        <span class="text-xs text-gray-500 font-medium">Mostrando {{ productService.products().length }} productos</span>
      </div>

      @if (productService.products().length === 0) {
        <div class="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <i class="pi pi-inbox text-4xl text-gray-400 mb-3"></i>
          <p class="text-gray-500 dark:text-gray-400">No hay productos registrados en el servidor.</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          @for (prod of productService.products(); track prod.id) {
            <app-product-card 
              [product]="prod" 
              (onAdd)="onAddToCart($event)"
              (onViewReviews)="onViewReviews.emit($event)">
            </app-product-card>
          }
        </div>
      }
    </div>
  `
})
export class ShopComponent implements OnInit {
  public productService = inject(ProductService);
  public cartService = inject(CartService);

  @Output() onViewReviews = new EventEmitter<Product>();

  ngOnInit() {
    this.productService.loadProducts();
    this.cartService.loadCart();
  }

  onAddToCart(productId: number) {
    this.cartService.addToCart(productId, 1);
  }
}
