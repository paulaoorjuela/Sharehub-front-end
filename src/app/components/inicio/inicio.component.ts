import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HijoInicioComponent } from '../hijo-inicio/hijo-inicio.component';
import { Ipublicaciones } from '../../../../models/publicacion';
import { SharehubApiService } from '../../services/sharehub-api.service';

@Component({
    selector: 'app-inicio',
    standalone: true,
    imports: [
        CommonModule,
        HijoInicioComponent
    ],
    templateUrl: './inicio.component.html',
    styleUrl: './inicio.component.css'
})
export class InicioComponent {
    constructor(private router: Router) { }

    publicaciones = signal<any>([])
    publicacionesDataUsuario:any = []
    private publicacionesServices = inject(SharehubApiService)

    ngOnInit() {

        if (sessionStorage.getItem("token") == null) {
            this.router.navigate(['/'])
        }

        this.publicacionesServices.getPublicaciones().subscribe({
            next: (publicaciones2) => {
                this.publicaciones.set(publicaciones2)
                // console.log(this.publicaciones());

                this.publicaciones().forEach((publicacion: any) => {
                    if (publicacion.idUsuario != null) {
                        let idUsuarioPublicacion = publicacion.idUsuario
                        this.publicacionesServices.getUsuario(idUsuarioPublicacion).subscribe({
                            next: (dataUsuario: any) => {
                                publicacion.nombreUsuario = dataUsuario.nombre
                                if(dataUsuario.imguser == '' || dataUsuario.imguser == null){
                                    publicacion.imgUsuario = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'
                                }else{
                                    publicacion.imgUsuario = dataUsuario.imguser

                                }
                            }
                        })
                        this.publicacionesDataUsuario.push(publicacion)
                        this.publicacionesDataUsuario.reverse()
                        // console.log(publicacion)
                    }
                });

            }, error: (err) => {
                console.log(err);
            }
        })


    }
    ngOnchange() {
        this.publicacionesServices.getPublicaciones().subscribe({
            next: (publicaciones2) => {
                this.publicaciones.set(publicaciones2)
                // console.log(this.publicaciones());

            }, error: (err) => {
                console.log(err);
            }
        })

    }

    // --------------prueba de comentarios-----------------
    // publicaciones = signal<Ipublicaciones[]>([
    //     {
    //     nombre: "Carlos Martinez",
    //     imagenUsuario:"https://cdn0.psicologia-online.com/es/posts/8/5/1/como_desenamorarse_de_alguien_rapido_5158_600.jpg" ,
    //     imagenPublicacion: "https://laopinion.com/wp-content/uploads/sites/3/2022/03/nostalgia.jpg?resize=360,202&quality=80",
    //     textPublicacion: "publicacion de prueba 1"
    //     },
    //     {
    //     nombre: "Layhan Perez",
    //     imagenUsuario:"https://cdn0.psicologia-online.com/es/posts/8/5/1/como_desenamorarse_de_alguien_rapido_5158_600.jpg" ,
    //     imagenPublicacion: "https://laopinion.com/wp-content/uploads/sites/3/2022/03/nostalgia.jpg?resize=360,202&quality=80",
    //     textPublicacion: "publicacion de prueba 2"
    //     },
    //     {
    //     nombre: "Seferino cañate",
    //     imagenUsuario:"https://cdn0.psicologia-online.com/es/posts/8/5/1/como_desenamorarse_de_alguien_rapido_5158_600.jpg" ,
    //     imagenPublicacion: "",
    //     textPublicacion: "publicacion de prueba 3"
    //     },

    // ])
}
