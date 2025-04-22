import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// ✅ Firebase con compatibilidad (modo clásico)
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

// ✅ Routing
import { AppRoutingModule } from './app-routing.module';

// ✅ Componentes
import { NotFoundComponent } from './pages/not-found/not-found.component';

// ✅ Environment
import { environment } from '../app/envitoments/envitoment';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // ✅ Inicializa Firebase de forma compatible con NgModules
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
