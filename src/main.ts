import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http'; // <--- ESTO ES VITAL

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient() // <--- AGREGAR ESTO
  ]
}).catch((err) => console.error(err));