import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MatTableModule } from '@angular/material/table';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



import { LandingPageComponent } from './Landing-page/landing-page.component';
import { FormularioComponent } from './Formulario/formulario/formulario.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { ProfileComponent } from './Auth/profile/profile.component';
import { LogoutComponent } from './Auth/logout/logout.component';
import { AuthInterceptor } from './Auth/auth.interceptor';
import { RutasModule } from './Rutas/rutas.module';
import { SharedModule } from './Shared/shared.module';
import { GraciasComponent } from './Formulario/gracias/gracias.component';
import { GuiasModule } from './Guias/components/guias.module';
import { CMSModule } from './CMS/cms.module';




@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    FormularioComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    LogoutComponent,
    GraciasComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatIconModule,
    RutasModule,
    CMSModule,
    SharedModule,
    MatCardModule,
    MatButtonModule,
    GuiasModule,
    MatTableModule,
    MatIcon,
    MatSnackBarModule,
    MatProgressSpinner,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
