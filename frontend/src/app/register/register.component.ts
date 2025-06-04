import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  public nombre: string = "";
  public email: string = "";
  public password: string = "";
  public apiResponse: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    const session = sessionStorage.getItem('token');
    if (session && session.trim() !== "") {
      this.router.navigate(['/home']);
    }
  }

  public registrarUsuario() {
    const url = "http://localhost:6762/api/auth/register";

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const body = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    };

    this.http.post(url, body, { headers }).subscribe({
      next: (resp: any) => {
        console.log("Usuario registrado correctamente:", resp);
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        this.router.navigate(['/login']);
      },
      error: err => {
        console.error("Error al registrar usuario:", err);
        alert("Hubo un error al registrar el usuario.");
      }
    });
  }

  public irAlLogin() {
    this.router.navigate(['/login']);
  }
}
