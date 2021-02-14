import { ProjectGuard } from './guards/project.guard';
import { MenuComponent } from './components/views/menu/menu.component';
import { BoardComponent } from './components/views/board/board.component';
import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/views/login/login.component';

const routes: Routes = [
  { path: '', component: BoardComponent, canActivate: [AuthGuard, ProjectGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'auth', component: LoginComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
