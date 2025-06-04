import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, NgFor],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  public contactos: any[] = [];
  public contacto: any = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.obtenerContactos();
  }

  obtenerContactos(): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('http://localhost:6762/api/contactos', { headers })
      .subscribe({
        next: (resp: any) => {
          this.contactos = resp.contactos || [];
        },
        error: err => {
          console.error('Error al obtener contactos:', err);
        }
      });
  }

  guardarContacto(): void {
  const token = sessionStorage.getItem('token');
  if (!token) return;

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  const body = this.contacto;

  if (body._id) {
    // Actualizar
    this.http.put(`http://localhost:6762/api/contacto/${body._id}`, body, { headers }).subscribe({
      next: () => {
        this.contacto = { nombre: '', apellidos: '', email: '', telefonoFijo: '', celular: '' };
        this.obtenerContactos();
      },
      error: err => {
        if (err.status === 409) {
          alert('El número de celular ya está registrado.');
        } else {
          console.error('Error al actualizar contacto:', err);
        }
      }
    });
  } else {
    // Crear
    this.http.post('http://localhost:6762/api/contacto', body, { headers }).subscribe({
      next: () => {
        this.contacto = { nombre: '', apellidos: '', email: '', telefonoFijo: '', celular: '' };
        this.obtenerContactos();
      },
      error: err => {
        if (err.status === 409) {
          alert('El número de celular ya está registrado.');
        } else {
          console.error('Error al crear contacto:', err);
        }
      }
    });
  }
}


  editarContacto(c: any): void {
    this.contacto = { ...c };
  }

  eliminarContacto(id: string): void {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.delete(`http://localhost:6762/api/contacto/${id}`, { headers }).subscribe({
      next: () => this.obtenerContactos(),
      error: err => console.error('Error al eliminar contacto:', err)
    });
  }
  cerrarSesion(): void {
    sessionStorage.clear(); 
    this.router.navigate(['/login']);
  }
}
