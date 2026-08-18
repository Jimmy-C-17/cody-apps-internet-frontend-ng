import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, switchMap } from 'rxjs';
import { environment } from '@environments/environment';

export interface User {
  id?: number;
  username: string;
  email: string;
  role?: string;
  // Añadir más campos si los devuelve `/api/v1/auth/me`
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  private apiUrl = `${environment.apiUrl}/auth`;

  private http = inject(HttpClient);

  // Usamos signals para un estado reactivo moderno
  currentUser = signal<User | null>(null);

  constructor(private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      // Intentamos cargar el usuario real del backend
      this.fetchMe().subscribe({
        error: () => this.logout() // Si el token expiró, lo sacamos
      });
    }
  }

  // Petición HTTP POST /register
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData);
  }

  // Petición HTTP POST /login (OAuth2 form data)
  login(credentials: any): Observable<any> {
    const body = new URLSearchParams();
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.http.post<any>(`${this.apiUrl}/login`, body.toString(), { headers }).pipe(
      tap(response => {
        // Asume que FastAPI responde con { "access_token": "...", "token_type": "bearer" }
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
      }),
      switchMap(() => this.fetchMe()) // Después del login, obtenemos los datos del usuario
    );
  }

  // Petición GET /me para traer los datos reales del usuario
  fetchMe(): Observable<User> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.apiUrl}/me`, { headers }).pipe(
      tap(user => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/signin']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
}
