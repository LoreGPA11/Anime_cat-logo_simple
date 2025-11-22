import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // <--- Para conectar con el Backend

export interface Anime {
  id?: number; // Agregamos el ID opcional (la base de datos lo genera)
  nombre: string;
  anioInicio: number | null;
  anioTermino: number | null;
  volumenes: number | null;
  comentarios: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'El Catálogo de Anime de todos';
  
  // Inyectamos el cliente HTTP
  http = inject(HttpClient);

  // ⚠️ IMPORTANTE: Aquí debes pegar la URL que te dio Render al crear el "Web Service" (Backend)
  // Ejemplo: 'https://anime-backend-xyz.onrender.com/animes'
  apiUrl = 'TU_URL_DEL_BACKEND_AQUI/animes'; 

  listaAnime: Anime[] = [];
  
  // Variables para controlar el formulario y la edición
  nuevoAnime: Anime = {
    nombre: '',
    anioInicio: null,
    anioTermino: null,
    volumenes: null,
    comentarios: ''
  };

  editandoId: number | null = null; // Si esto tiene un número, estamos editando

  // Al iniciar la app, cargamos los datos de la nube
  ngOnInit() {
    this.cargarAnimes();
  }

  // --- LEER (GET) ---
  cargarAnimes() {
    this.http.get<Anime[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.listaAnime = data;
        console.log('Datos cargados:', data);
      },
      error: (e) => console.error('Error cargando animes:', e)
    });
  }

  // --- GUARDAR O ACTUALIZAR (POST / PUT) ---
  guardarAnime() {
    if (!this.nuevoAnime.nombre) return alert("Nombre obligatorio");

    if (this.editandoId) {
      // MODO EDICIÓN: Actualizamos el existente
      this.http.put(`${this.apiUrl}/${this.editandoId}`, this.nuevoAnime)
        .subscribe(() => {
          this.cargarAnimes(); // Recargar lista
          this.resetForm();    // Limpiar formulario
        });
    } else {
      // MODO CREACIÓN: Creamos uno nuevo
      this.http.post(this.apiUrl, this.nuevoAnime)
        .subscribe(() => {
          this.cargarAnimes(); // Recargar lista
          this.resetForm();    // Limpiar formulario
        });
    }
  }

  // --- ELIMINAR (DELETE) ---
  eliminar(id: number | undefined) {
    if (!id) return;
    if(confirm('¿Seguro que quieres borrar este anime?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.cargarAnimes(); // Recargar lista
      });
    }
  }

  // --- PREPARAR PARA EDITAR ---
  cargarParaEditar(anime: Anime) {
    this.editandoId = anime.id || null;
    this.nuevoAnime = { ...anime }; // Copiamos los datos al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Subir al formulario
  }

  // --- LIMPIAR FORMULARIO ---
  resetForm() {
    this.editandoId = null;
    this.nuevoAnime = {
      nombre: '', anioInicio: null, anioTermino: null, volumenes: null, comentarios: ''
    };
  }
}