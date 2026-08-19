import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RatingModule } from 'primeng/rating';
import { ReviewService } from '../../services/review.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    RatingModule
  ],
  template: `
    <p-dialog 
      [visible]="visible" 
      (visibleChange)="onVisibleChange($event)"
      [style]="{ width: '550px' }" 
      [header]="'Reseñas de ' + (product?.title || 'Producto')" 
      [modal]="true"
      styleClass="p-fluid">
      
      <div class="flex flex-col gap-6 my-2">
        <!-- Formulario para Nueva Reseña -->
        <div class="bg-gray-50 dark:bg-gray-800/60 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <h4 class="font-bold text-gray-800 dark:text-white mb-3">Escribir una reseña</h4>
          
          <div class="field mb-3">
            <label class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Calificación</label>
            <p-rating [(ngModel)]="rating" stars="5"></p-rating>
          </div>

          <div class="field mb-3">
            <label for="comment" class="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">Comentario</label>
            <textarea 
              id="comment" 
              pTextarea 
              [(ngModel)]="comment" 
              rows="3" 
              placeholder="¿Qué te pareció este producto?" 
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            </textarea>
          </div>

          <div class="flex justify-end">
            <p-button 
              label="Guardar Reseña" 
              icon="pi pi-send" 
              severity="primary" 
              [disabled]="!comment.trim() || rating < 1"
              (onClick)="submitReview()">
            </p-button>
          </div>
        </div>

        <!-- Lista de Reseñas Existentes -->
        <div>
          <h4 class="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
            <span>Opiniones de clientes</span>
            <span class="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
              {{ reviewService.reviews().length }}
            </span>
          </h4>

          @if (reviewService.reviews().length === 0) {
            <p class="text-sm text-gray-400 italic text-center py-6">Este producto aún no tiene reseñas. ¡Sé el primero en opimar!</p>
          } @else {
            <div class="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
              @for (rev of reviewService.reviews(); track (rev.id || \$index)) {
                <div class="p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700 shadow-xs">
                  <div class="flex items-center justify-between mb-1">
                    <p-rating [ngModel]="rev.rating" [readonly]="true"></p-rating>
                    <span class="text-xs text-gray-400 font-mono">Usuario #{{ rev.user_id || 'Anónimo' }}</span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-200 mt-1">{{ rev.comment }}</p>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button label="Cerrar" icon="pi pi-times" [text]="true" severity="secondary" (onClick)="close()"></p-button>
      </ng-template>
    </p-dialog>
  `
})
export class ReviewDialogComponent {
  public reviewService = inject(ReviewService);

  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() product: Product | null = null;

  rating: number = 5;
  comment: string = '';

  onVisibleChange(val: boolean) {
    this.visible = val;
    this.visibleChange.emit(val);
  }

  submitReview() {
    if (this.product?.id && this.comment.trim() && this.rating >= 1) {
      this.reviewService.createReview(this.product.id, this.rating, this.comment.trim());
      this.comment = '';
      this.rating = 5;
    }
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
