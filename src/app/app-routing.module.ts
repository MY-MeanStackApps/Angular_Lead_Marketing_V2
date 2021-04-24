import { LeadingComment } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SingleComponent } from './pages/single/single.component';

const routes: Routes = [
  {path:'', redirectTo:'dashboard', pathMatch: 'full'},
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {path: 'single/:id', component: SingleComponent },
  {path:'**',  redirectTo:'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
