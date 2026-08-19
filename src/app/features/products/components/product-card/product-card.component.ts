import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, BadgeModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between h-full">
      <div>
        <div class="flex justify-between items-start mb-3">
          <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
            Cat #{{ product.category_id }}
          </span>
          @if (product.stock === 0) {
            <span class="px-2.5 py-0.5 text-xs font-bold bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400 rounded-full">
              Agotado
            </span>
          } @else {
            <span class="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full">
              {{ product.stock }} en stock
            </span>
          }
        </div>

        <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1">{{ product.title }}</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 min-h-[2rem] mb-4">
          {{ product.description || 'Sin descripción disponible.' }}
        </p>
      </div>

      <div>
        <div class="flex items-baseline justify-between mb-4">
          <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">\${{ product.price | number:'1.2-2' }}</span>
          
          <button 
            type="button"
            (click)="onViewReviews.emit(product)"
            class="text-xs text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 font-medium flex items-center gap-1 hover:underline cursor-pointer">
            <i class="pi pi-comments text-xs"></i> Reseñas
          </button>
        </div>

        <p-button 
          label="Añadir al Carrito" 
          icon="pi pi-shopping-cart" 
          severity="success" 
          styleClass="w-full"
          [disabled]="product.stock === 0"
          (onClick)="product.id && onAdd.emit(product.id)">
        </p-button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() onAdd = new EventEmitter<number>();
  @Output() onViewReviews = new EventEmitter<Product>();
}
