import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-signup-form',
  imports: [
    RouterModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule
  ],
  templateUrl: './signup-form.component.html',
  styles: `
    :host ::ng-deep .p-password input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
      background-color: transparent;
      color: inherit;
    }
    :host ::ng-deep .dark .p-password input {
      border-color: rgba(255, 255, 255, 0.1);
    }
    :host ::ng-deep .p-password {
      width: 100%;
    }
    :host ::ng-deep .p-checkbox-box {
      border: 1px solid #e5e7eb;
      border-radius: 0.25rem;
    }
  `
})
export class SignupFormComponent {

  isChecked = false;
  isLoading = false;

  username = '';
  email = '';
  password = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = '';

  onSignUp() {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(this.username)) {
      this.errorMessage = 'El nombre de usuario no puede contener espacios ni caracteres especiales.';
      return;
    }

    if (!this.email || !this.password || !this.username) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const userData = {
      email: this.email,
      username: this.username,
      password: this.password,
      is_active: true
    };

    this.authService.register(userData).subscribe({
      next: () => {
        this.isLoading = false;
        // Dependiendo de tu backend, si autologea lo mandas a '/'
        // si no, lo mandas a '/signin' para que ingrese sus datos.
        this.router.navigate(['/signin']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Hubo un error al registrarse. Inténtalo de nuevo.';
        console.error('Register failed', err);
      }
    });
  }
}
