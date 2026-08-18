import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Bienvenido al Panel de Control</h2>
      <p class="text-gray-600 dark:text-gray-400">
        Hola {{ authService.currentUser()?.username }}. Desde aquí podrás administrar el contenido del sistema.
      </p>
    </div>
  `,
})
export class DashboardComponent {
  authService = inject(AuthService);
}
