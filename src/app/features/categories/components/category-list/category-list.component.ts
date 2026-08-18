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
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, 
    InputTextModule, DialogModule, ConfirmDialogModule, ToastModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './category-list.component.html'
})
export class CategoryListComponent implements OnInit {
  public categoryService = inject(CategoryService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  category!: Partial<Category>;
  categoryDialog: boolean = false;
  submitted: boolean = false;

  ngOnInit() {
    this.categoryService.loadCategories();
  }

  openNew() {
    this.category = {};
    this.submitted = false;
    this.categoryDialog = true;
  }

  editCategory(cat: Category) {
    this.category = { ...cat };
    this.categoryDialog = true;
  }

  deleteCategory(cat: Category) {
    this.confirmationService.confirm({
      message: '¿Estás seguro de eliminar "' + cat.title + '"?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (cat.id) {
          this.categoryService.deleteCategory(cat.id);
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Eliminado', life: 3000 });
        }
      }
    });
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  saveCategory() {
    this.submitted = true;
    if (this.category.title?.trim()) {
      if (this.category.id) {
        this.categoryService.updateCategory(this.category.id, this.category as Category);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Actualizado', life: 3000 });
      } else {
        this.categoryService.createCategory(this.category as Omit<Category, 'id'>);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Creado', life: 3000 });
      }
      this.categoryDialog = false;
    }
  }
}
