import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Landing-page/landing-page.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { LogoutComponent } from './Auth/logout/logout.component';
import { ProfileComponent } from './Auth/profile/profile.component';
import { AuthGuard } from './Auth/auth.guard';
import { FormularioComponent } from './Formulario/formulario/formulario.component';
import { GraciasComponent } from './Formulario/gracias/gracias.component';
import { VistaRutasComponent } from './Rutas/components/vista-rutas/vista-rutas.component';
import { RutaComponent } from './Rutas/components/ruta/ruta.component';
import { VistaGuiasComponent } from './Guias/components/vista-guias/vista-guias.component';
import { GuiaComponent } from './Guias/components/guia/guia.component';
import { GestionClientesComponent } from './CMS/component/gestion-clientes/gestion-clientes.component';
import { CmsGuard } from './CMS/guards/cms.guard';
import { GestionGuiasComponent } from './CMS/component/gestion-guias/gestion-guias.component';
import { GestionRutasComponent } from './CMS/component/gestion-rutas/gestion-rutas.component';
import { SobreNosotrosComponent } from './Shared/sobre-nosotros/sobre-nosotros.component';
import { ContactoComponent } from './Shared/contacto/contacto.component';
import { PrivacidadComponent } from './Shared/privacidad/privacidad.component';
import { CookiesComponent } from './Shared/cookies/cookies.component';
import { AvisoLegalComponent } from './Shared/aviso-legal/aviso-legal.component';



const routes: Routes = [
  { path: '', component: LandingPageComponent},
  { path: 'rutas', component: VistaRutasComponent},
  { path: 'rutas/:id', component: RutaComponent},
  { path: 'guias', component: VistaGuiasComponent},
  { path: 'guias/:id', component: GuiaComponent},
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'formulario', component: FormularioComponent },
  { path: 'gracias/:nombre', component:GraciasComponent},
  { path: 'cms/gestion-guias', component:GestionGuiasComponent, canActivate:[CmsGuard]},
  { path: 'cms/gestion-rutas', component:GestionRutasComponent, canActivate:[CmsGuard]},
  { path: 'cms/gestion-clientes', component:GestionClientesComponent, canActivate:[CmsGuard]},
  { path: 'sobre-nosotros', component:SobreNosotrosComponent},
  { path: 'contacto', component:ContactoComponent},
  { path: 'politica-privacidad', component:PrivacidadComponent},
  { path: 'politica-cookies', component:CookiesComponent},
  { path: 'aviso-legal', component:AvisoLegalComponent},
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
