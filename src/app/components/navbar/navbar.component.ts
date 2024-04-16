import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharehubApiService } from '../../services/sharehub-api.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css',
})
export class NavbarComponent {
    private Services = inject(SharehubApiService);
    idUsuarioPayload!: string;
    URLProyecto = '//' + location.hostname + ':' + location.port;
    imguser: string = '';
    usuariosEncontrados: any = [];
    constructor(private router: Router) {}

    ngOnInit() {
        if (sessionStorage.getItem('token') == null) {
            this.router.navigate(['/']);
        }

        let tokenSession = sessionStorage.getItem('token');
        this.Services.postDesencriptarPayload(tokenSession).subscribe(
            (respuestaApi: any) => {
                this.idUsuarioPayload = respuestaApi.id;
                this.Services.getUsuario(respuestaApi.id).subscribe({
                    next: (respuestaApi: any) => {
                        this.imguser = respuestaApi.imguser;
                        console.log("-----------------");

                        console.log(respuestaApi);
                        console.log("-----------------");
                        let imagenUsuario = respuestaApi.imguser
                        console.log(imagenUsuario);

                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
            }
        );

        this.Services.postDesencriptarPayload(tokenSession).subscribe(
            (respuestaApi: any) => {
                console.log(respuestaApi);
                this.idUsuarioPayload = respuestaApi.id;
                // this.router.navigate([`/mi-perfil/${this.idUsuarioPayload}`])
            }
        );
    }

    clearSessionStorage() {
        sessionStorage.clear();
        location.reload();
    }

    buscarUsuarios(event: any) {
        const palabraClave = event.target.value;
        this.router.navigate([
            `/resultados-busqueda/${palabraClave}`]);
    }

    redireccion() {
        this.router.navigate([
            `/resultados-busqueda`]);
    }
}
