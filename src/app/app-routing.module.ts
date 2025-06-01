import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ChallangeListScreenComponent } from './pages/challange-list-screen/challange-list-screen.component';
import { ChallangeDetailsComponent } from './pages/challange-details/challange-details.component';
import { ConcursoFormComponent } from './pages/concurso-form/concurso-form.component';
import { ConcursoUsuario} from './pages/concurso-usuario/concurso-usuario.component'
import { UploadComponent } from './shared/upload/upload.component';
import { AuthGuard } from './auth.guard'; // ajusta el path si es necesario
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'challanges', component: ChallangeListScreenComponent, canActivate: [AuthGuard] },
  { path: 'Concursousuario', component: ConcursoUsuario, canActivate: [AuthGuard] },
  { path: 'challangeDetails/:id', component: ChallangeDetailsComponent, canActivate: [AuthGuard] },
  { path: 'newChallange', component: ConcursoFormComponent, canActivate: [AuthGuard] },
  { path: 'a', component: UploadComponent, canActivate: [AuthGuard] },
  { path: 'personalProfile/:uid', component: ProfileComponent, canActivate: [AuthGuard] },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
