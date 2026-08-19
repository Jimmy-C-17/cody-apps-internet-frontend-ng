import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../../cart/services/cart.service';
import { ReviewService } from '../../services/review.service';
import { Product } from '../../models/product.model';
import { ShopComponent } from '../shop/shop.component';
import { ProductListComponent } from './product-list.component';
import { ReviewDialogComponent } from '../review-dialog/review-dialog.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ToastModule,
    ShopComponent,
    ProductListComponent,
    ReviewDialogComponent
  ],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="p-6 space-y-6">
      <!-- Encabezado con Cambiador de Vista -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Tienda & Productos</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Explora productos, agrégalos al carrito o administra el inventario</p>
        </div>

        <div class="inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 self-start">
          <button 
            (click)="activeView = 'shop'"
            [class.bg-white]="activeView === 'shop'"
            [class.dark:bg-gray-700]="activeView === 'shop'"
            [class.shadow-xs]="activeView === 'shop'"
            [class.text-indigo-600]="activeView === 'shop'"
            [class.dark:text-indigo-400]="activeView === 'shop'"
            class="px-4 py-2 text-sm font-semibold rounded-lg transition-all text-gray-600 dark:text-gray-400 flex items-center gap-2 cursor-pointer">
            <i class="pi pi-shopping-bag"></i> Catálogo Tienda
          </button>
          <button 
            (click)="activeView = 'admin'"
            [class.bg-white]="activeView === 'admin'"
            [class.dark:bg-gray-700]="activeView === 'admin'"
            [class.shadow-xs]="activeView === 'admin'"
            [class.text-indigo-600]="activeView === 'admin'"
            [class.dark:text-indigo-400]="activeView === 'admin'"
            class="px-4 py-2 text-sm font-semibold rounded-lg transition-all text-gray-600 dark:text-gray-400 flex items-center gap-2 cursor-pointer">
            <i class="pi pi-list"></i> Gestión Admin (CRUD)
          </button>
        </div>
      </div>

      <!-- VISTA 1: Catálogo de Tienda (Smart Component: ShopComponent) -->
      @if (activeView === 'shop') {
        <app-shop (onViewReviews)="openReviewsDialog($event)"></app-shop>
      }

      <!-- VISTA 2: Gestión de Tabla Admin (Reto 2 CRUD) -->
      @if (activeView === 'admin') {
        <app-product-list></app-product-list>
      }
    </div>

    <!-- Modal de Reseñas (Reto 4) -->
    <app-review-dialog 
      [(visible)]="reviewsDialogVisible" 
      [product]="selectedProductForReviews">
    </app-review-dialog>
  `
})
export class ProductsComponent implements OnInit {
  public productService = inject(ProductService);
  public cartService = inject(CartService);
  public reviewService = inject(ReviewService);

  activeView: 'shop' | 'admin' = 'shop';

  reviewsDialogVisible: boolean = false;
  selectedProductForReviews: Product | null = null;

  ngOnInit() {
    this.productService.loadProducts();
    this.cartService.loadCart();
  }

  openReviewsDialog(product: Product) {
    this.selectedProductForReviews = product;
    if (product.id) {
      this.reviewService.loadReviews(product.id);
    }
    this.reviewsDialogVisible = true;
  }
}
