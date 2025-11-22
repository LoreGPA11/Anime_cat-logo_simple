import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- NECESARIO PARA *ngFor y *ngIf
import { FormsModule } from '@angular/forms';   // <--- NECESARIO PARA [(ngModel)]

// Interfaz
export interface Anime {
  nombre: string;
  anioInicio: number | null;
  anioTermino: number | null;
  volumenes: number | null;
  comentarios: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  // OJO AQUÍ: Esta línea es la que arregla la pantalla blanca
  imports: [CommonModule, FormsModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'El Catálogo de Anime de todos';

  nuevoAnime: Anime = {
    nombre: '',
    anioInicio: null,
    anioTermino: null,
    volumenes: null,
    comentarios: ''
  };

  listaAnime: Anime[] = [
    {
      nombre: 'Neon Genesis Evangelion',
      anioInicio: 1995,
      anioTermino: 1996,
      volumenes: 26,
      comentarios: 'Un clásico psicológico indispensable.'
    },
    {
      nombre: 'Fullmetal Alchemist: Brotherhood',
      anioInicio: 2009,
      anioTermino: 2010,
      volumenes: 64,
      comentarios: 'Excelente historia y desarrollo de personajes.'
    }
  ];

  agregarAnime() {
    if (this.nuevoAnime.nombre.trim() !== '') {
      this.listaAnime.push({ ...this.nuevoAnime });
      // Resetear formulario
      this.nuevoAnime = {
        nombre: '',
        anioInicio: null,
        anioTermino: null,
        volumenes: null,
        comentarios: ''
      };
    } else {
        alert("Por favor ingresa al menos el nombre del anime.");
    }
  }
}