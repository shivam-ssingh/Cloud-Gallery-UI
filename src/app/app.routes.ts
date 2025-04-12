import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FolderViewComponent } from './folder-view/folder-view.component';
import { UploadComponent } from './upload/upload.component';
import { authGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'upload/:slug',
    component: UploadComponent,
    canActivate: [authGuard],
  },
  { path: 'gallery/:slug', component: FolderViewComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', component: HomeComponent },
];
