import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminFooterComponent } from './admin-footer/admin-footer.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: AdminLayoutComponent, children: [
    { path: 'add-ingredient', component: IngredientsComponent},
    { path: 'edit-ingredient', component: IngredientsComponent}
  ]},
];

@NgModule({
  declarations: [ AdminLayoutComponent, AdminHeaderComponent, AdminFooterComponent, AdminSidebarComponent, IngredientsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminModule { }
