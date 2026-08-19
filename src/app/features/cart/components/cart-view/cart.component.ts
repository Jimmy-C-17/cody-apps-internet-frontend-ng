import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../../products/services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast></p-toast>

    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white">Carrito de Compras</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Revisa los productos agregados desde la tienda</p>
        </div>

        <button 
          (click)="cartService.loadCart()"
          class="px-3 py-1.5 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer">
          <i class="pi pi-refresh"></i> Actualizar
        </button>
      </div>

      @if (cartService.cartItems().length === 0) {
        <div class="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="pi pi-shopping-cart text-2xl"></i>
          </div>
          <h3 class="text-lg font-bold text-gray-800 dark:text-white">Tu carrito está vacío</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Visita nuestro catálogo de productos y haz clic en "Añadir al Carrito".
          </p>
        </div>
      } @else {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Lista de Items en Carrito -->
          <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead class="text-xs uppercase bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th class="py-3 px-4 rounded-l-lg">Producto</th>
                    <th class="py-3 px-4">Precio</th>
                    <th class="py-3 px-4">Cantidad</th>
                    <th class="py-3 px-4">Subtotal</th>
                    <th class="py-3 px-4 text-right rounded-r-lg">Acción</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                  @for (item of enrichedCartItems(); track item.id) {
                    <tr>
                      <td class="py-4 px-4 font-medium text-gray-900 dark:text-white">
                        <div>
                          <p class="font-bold">{{ item.productName }}</p>
                          <span class="text-xs text-gray-400">ID Prod: {{ item.product_id }}</span>
                        </div>
                      </td>
                      <td class="py-4 px-4 font-mono">\${{ item.price | number:'1.2-2' }}</td>
                      <td class="py-4 px-4">
                        <span class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 font-bold rounded-lg text-xs">
                          {{ item.quantity }}
                        </span>
                      </td>
                      <td class="py-4 px-4 font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        \${{ (item.price * item.quantity) | number:'1.2-2' }}
                      </td>
                      <td class="py-4 px-4 text-right">
                        <p-button 
                          icon="pi pi-trash" 
                          severity="danger" 
                          [rounded]="true" 
                          [text]="true"
                          (onClick)="deleteItem(item.id)">
                        </p-button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Resumen de Pedido -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm flex flex-col justify-between h-fit">
            <div>
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Resumen del Pedido</h3>
              
              <div class="space-y-3 text-sm">
                <div class="flex justify-between text-gray-500">
                  <span>Cantidad de Items</span>
                  <span class="font-bold text-gray-800 dark:text-white">{{ totalItems() }}</span>
                </div>
                <div class="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span class="font-mono text-gray-800 dark:text-white">\${{ totalAmount() | number:'1.2-2' }}</span>
                </div>
                <div class="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-semibold">GRATIS</span>
                </div>
                <div class="pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-between items-baseline">
                  <span class="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    \${{ totalAmount() | number:'1.2-2' }}
                  </span>
                </div>
              </div>
            </div>

            <p-button 
              label="Procesar Compra" 
              icon="pi pi-check-circle" 
              severity="success" 
              styleClass="w-full mt-6"
              (onClick)="checkout()">
            </p-button>
          </div>
        </div>
      }
    </div>
  `
})
export class CartComponent implements OnInit {
  public cartService = inject(CartService);
  public productService = inject(ProductService);
  private messageService = inject(MessageService);

  enrichedCartItems = computed(() => {
    const items = this.cartService.cartItems();
    const products = this.productService.products();

    return items.map((item) => {
      const foundProduct = products.find((p) => p.id === item.product_id);
      return {
        ...item,
        productName: foundProduct ? foundProduct.title : `Producto #${item.product_id}`,
        price: foundProduct ? foundProduct.price : 0
      };
    });
  });

  totalItems = computed(() => {
    return this.cartService.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  totalAmount = computed(() => {
    return this.enrichedCartItems().reduce((acc, item) => acc + item.price * item.quantity, 0);
  });

  ngOnInit() {
    this.productService.loadProducts();
    this.cartService.loadCart();
  }

  deleteItem(cartItemId: number) {
    this.cartService.deleteCartItem(cartItemId);
    this.messageService.add({
      severity: 'info',
      summary: 'Item Eliminado',
      detail: 'Se ha removido el producto del carrito.',
      life: 2500
    });
  }

  checkout() {
    this.messageService.add({
      severity: 'success',
      summary: '¡Compra Procesada!',
      detail: 'Gracias por tu compra.',
      life: 3000
    });
  }
}
