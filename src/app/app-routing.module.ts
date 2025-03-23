import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: 'home' , component: HomeComponent },
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
