import { Routes } from '@angular/router';
import { InicioComponent } from '../app/components/inicio/inicio.component'
import { GruposComponent } from "../app/components/grupos/grupos.component";
import { ListadoGruposComponent } from "../app/components/listado-grupos/listado-grupos.component";
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { RegistroGruposComponent } from "../app/components/registro-grupos/registro-grupos.component";
import { Erro404Component } from './components/erro404/erro404.component';
import { autenticacionGuardGuard } from './guards/autenticacion.guard.guard';
import { ChatComponent } from './components/chat/chat.component';
import { ResutadoBusquedaComponent } from './components/resutado-busqueda/resutado-busqueda.component';


const tituloPagina = "ShareHub"

let vistaUsuarioSession = ''


export const routes: Routes = [
    { path: 'inicio', title: `Inicio | ${tituloPagina}`, component: InicioComponent },
    { path: 'resultados-busqueda/:palabraClave', title: `Buscar | ${tituloPagina}`, component: ResutadoBusquedaComponent},
    { path: 'resultados-busqueda', title: `Buscar | ${tituloPagina}`, component: ResutadoBusquedaComponent},
    { path: `grupos/:idGrupo`,title: `Grupo | ${tituloPagina}`,component:GruposComponent},
    { path: 'mis-grupos', title: `Mis grupos | ${tituloPagina}`, component:ListadoGruposComponent},
    { path: 'mi-perfil/:idPerfil', canMatch: [autenticacionGuardGuard], title: `Perfil | ${tituloPagina}`, component: PerfilComponent },
    { path: 'perfil/:idPerfil', canMatch: [autenticacionGuardGuard], title: `Perfil | ${tituloPagina}`, component: PerfilComponent },
    { path: '', title: `Login | ${tituloPagina}`, component: LoginComponent },
    { path: 'inicio', title: "Inicio de sesion", component: InicioComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'registro-grupos', canMatch: [autenticacionGuardGuard], title: `Registro Grupos | ${tituloPagina}`, component: RegistroGruposComponent },
    { path: 'chat/:userId', component: ChatComponent},
    { path: '404', title: `error 404 | ${tituloPagina}`, component: Erro404Component },
    // ----------------------------ultima ruta---------------------------------------
    { path: '**', pathMatch: 'full', redirectTo: "404" }
];
