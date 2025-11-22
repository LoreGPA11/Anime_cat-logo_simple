import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface Anime {
  id?: number;
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
// 1. Agregamos "implements OnInit" aquí
export class AppComponent implements OnInit {
  title = 'El Catálogo de Anime de todos';
  http = inject(HttpClient);
  
  // ¡OJO! Asegúrate de que esta URL sea la correcta de tu Backend en Render
  apiUrl = 'https://TU-BACKEND-AQUI.onrender.com/animes'; 

  listaAnime: Anime[] = [];
  
  // 2. Nueva variable para saber si estamos cargando
  cargando: boolean = true; 

  nuevoAnime: Anime = {
    nombre: '', anioInicio: null, anioTermino: null, volumenes: null, comentarios: ''
  };

  editandoId: number | null = null;

  // 3. ESTA ES LA FUNCIÓN CLAVE QUE TE FALTABA
  // Angular ejecuta esto automáticamente al inicio
  ngOnInit() {
    this.cargarAnimes();
  }

  cargarAnimes() {
    this.cargando = true; // Empieza a cargar
    this.http.get<Anime[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.listaAnime = data;
        this.cargando = false; // Terminó de cargar
      },
      error: (e) => {
        console.error(e);
        this.cargando = false; // Terminó (aunque sea con error)
      }
    });
  }

  guardarAnime() {
    if (!this.nuevoAnime.nombre) return alert("Nombre obligatorio");

    if (this.editandoId) {
      this.http.put(`${this.apiUrl}/${this.editandoId}`, this.nuevoAnime)
        .subscribe(() => { this.cargarAnimes(); this.resetForm(); });
    } else {
      this.http.post(this.apiUrl, this.nuevoAnime)
        .subscribe(() => { this.cargarAnimes(); this.resetForm(); });
    }
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    if(confirm('¿Borrar?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.cargarAnimes());
    }
  }

  cargarParaEditar(anime: Anime) {
    this.editandoId = anime.id || null;
    this.nuevoAnime = { ...anime };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetForm() {
    this.editandoId = null;
    this.nuevoAnime = { nombre: '', anioInicio: null, anioTermino: null, volumenes: null, comentarios: '' };
  }
}