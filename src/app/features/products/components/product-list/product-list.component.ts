import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    BadgeModule
  ],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast></p-toast>
    <p-confirmDialog></p-confirmDialog>

    <div class="card p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Productos</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">Administra el inventario de tu tienda</p>
        </div>
        <p-button label="Nuevo Producto" icon="pi pi-plus" severity="success" (onClick)="openNew()"></p-button>
      </div>
      
      <p-table [value]="productService.products()" [paginator]="true" [rows]="10" [tableStyle]="{ 'min-width': '50rem' }" responsiveLayout="scroll">
        <ng-template pTemplate="header">
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-prod>
          <tr>
            <td><span class="font-mono text-xs text-gray-500">#{{ prod.id }}</span></td>
            <td class="font-medium text-gray-900 dark:text-white">{{ prod.title }}</td>
            <td class="text-gray-500 max-w-xs truncate">{{ prod.description || '-' }}</td>
            <td class="font-semibold text-emerald-600 dark:text-emerald-400">\${{ prod.price | number:'1.2-2' }}</td>
            <td>
              @if (prod.stock === 0) {
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  <i class="pi pi-exclamation-circle text-xs"></i>
                  Agotado
                </span>
              } @else {
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {{ prod.stock }} disponibles
                </span>
              }
            </td>
            <td>
              <div class="flex gap-2">
                <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" severity="info" (onClick)="editProduct(prod)"></p-button>
                <p-button icon="pi pi-trash" severity="danger" [rounded]="true" [text]="true" (onClick)="deleteProduct(prod)"></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>

    <!-- Modal de Creación/Edición -->
    <p-dialog [(visible)]="productDialog" [style]="{ width: '450px' }" header="Detalles del Producto" [modal]="true" styleClass="p-fluid">
      <ng-template pTemplate="content">
        <div class="flex flex-col gap-4 mt-2">
          <div class="field">
            <label for="title" class="block font-medium mb-1 text-gray-700 dark:text-gray-200">Título</label>
            <input type="text" pInputText id="title" [(ngModel)]="product.title" required autofocus class="w-full" />
            @if (submitted && !product.title) {
              <small class="text-red-500 block mt-1">El título es requerido.</small>
            }
          </div>

          <div class="field">
            <label for="description" class="block font-medium mb-1 text-gray-700 dark:text-gray-200">Descripción</label>
            <input type="text" pInputText id="description" [(ngModel)]="product.description" class="w-full" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="field">
              <label for="price" class="block font-medium mb-1 text-gray-700 dark:text-gray-200">Precio ($)</label>
              <input type="number" pInputText id="price" [(ngModel)]="product.price" step="0.01" min="0" required class="w-full" />
              @if (submitted && (product.price === undefined || product.price === null)) {
                <small class="text-red-500 block mt-1">El precio es requerido.</small>
              }
            </div>

            <div class="field">
              <label for="stock" class="block font-medium mb-1 text-gray-700 dark:text-gray-200">Stock</label>
              <input type="number" pInputText id="stock" [(ngModel)]="product.stock" min="0" required class="w-full" />
              @if (submitted && (product.stock === undefined || product.stock === null)) {
                <small class="text-red-500 block mt-1">El stock es requerido.</small>
              }
            </div>
          </div>

          <div class="field">
            <label for="category" class="block font-medium mb-1 text-gray-700 dark:text-gray-200">Categoría ID</label>
            <select id="category" [(ngModel)]="product.category_id" class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
              @for (cat of categoryService.categories(); track cat.id) {
                <option [value]="cat.id">{{ cat.title }} (ID: {{ cat.id }})</option>
              }
            </select>
            @if (submitted && !product.category_id) {
              <small class="text-red-500 block mt-1">Selecciona una categoría.</small>
            }
          </div>
        </div>
      </ng-template>
      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" severity="secondary" (onClick)="hideDialog()"></p-button>
        <p-button label="Guardar" icon="pi pi-check" [text]="true" (onClick)="saveProduct()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class ProductListComponent implements OnInit {
  public productService = inject(ProductService);
  public categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  product!: Partial<Product>;
  productDialog: boolean = false;
  submitted: boolean = false;

  ngOnInit() {
    this.productService.loadProducts();
    this.categoryService.loadCategories();
  }

  openNew() {
    const categories = this.categoryService.categories();
    this.product = {
      title: '',
      description: '',
      price: 0,
      stock: 10,
      category_id: categories.length > 0 ? categories[0].id : 1
    };
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(prod: Product) {
    this.product = { ...prod };
    this.productDialog = true;
  }

  deleteProduct(prod: Product) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar "' + prod.title + '"?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (prod.id) {
          this.productService.deleteProduct(prod.id);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto eliminado', life: 3000 });
        }
      }
    });
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    if (this.product.title?.trim() && this.product.price !== undefined && this.product.stock !== undefined && this.product.category_id) {
      if (this.product.id) {
        this.productService.updateProduct(this.product.id, this.product);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
      } else {
        this.productService.createProduct(this.product as Omit<Product, 'id'>);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
      }
      this.productDialog = false;
    }
  }
}
