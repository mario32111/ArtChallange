import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { MenuComponent } from './pages/menu/menu.component';
import { BookComponent } from './pages/book/book.component';

const routes: Routes = [
  { path: 'home' , component: HomeComponent },
  { path: 'about' , component: AboutComponent },
  { path: 'menu' , component: MenuComponent },
  { path: 'book' , component: BookComponent},
  { path: '' , pathMatch: 'full', redirectTo: 'home' }
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
