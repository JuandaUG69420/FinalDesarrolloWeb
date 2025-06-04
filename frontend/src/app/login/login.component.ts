import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public email: string = "";
  public password: string = "";
  public apiResponse: any;
  public showError: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const session = sessionStorage.getItem('token');
    if (session) {
      const decoded = this.decodeToken(session);
      if (decoded) {
        this.router.navigate(['/contact']);
      } else {
        console.warn('Token inválido o expirado');
        sessionStorage.clear();
      }
    }
  }

  public validateCredentials() {
    const url = "http://localhost:6762/api/auth/login";
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const body = {
      email: this.email,
      password: this.password
    };

    this.http.post(url, body, { headers }).subscribe({
      next: (resp: any) => {
        const token = resp.token;
        sessionStorage.setItem('token', token);

        const decoded = this.decodeToken(token);
        if (decoded) {
          this.router.navigate(['/contact']);
        } else {
          console.error('Error al decodificar el token');
          this.showError = true;
        }
      },
      error: err => {
        console.error("Error en login:", err);
        this.showError = true;
      }
    });
  }

  public registrar() {
    this.router.navigate(['/register']);
  }

  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Error al decodificar el token:', e);
      return null;
    }
  }
}
