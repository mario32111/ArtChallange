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

const routes: Routes = [
  { path: 'home' , component: HomeComponent },
  { path: 'login' , component: LoginComponent },
  { path: 'register' , component: RegisterComponent },
  { path: 'challanges' , component: ChallangeListScreenComponent },
  { path: 'challangeDetails' , component: ChallangeDetailsComponent },
  { path: 'newChallange' , component: ConcursoFormComponent },

  { path: '' , pathMatch: 'full', redirectTo: 'home' },
  { path: '**', component: NotFoundComponent },
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
