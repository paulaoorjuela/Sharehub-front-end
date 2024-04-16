import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InicioComponent } from '../app/components/inicio/inicio.component'
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenuIzquierdaComponent } from './components/menu-izquierda/menu-izquierda.component';
import { MenuDerechaComponent } from './components/menu-derecha/menu-derecha.component';
import { LoginComponent } from './components/login/login.component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SharehubApiService } from '../../src/app/services/sharehub-api.service';
import { ChatComponent } from './components/chat/chat.component';


@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterOutlet,
        CommonModule,
        NavbarComponent,
        MenuIzquierdaComponent,
        InicioComponent,
        MenuDerechaComponent,
        LoginComponent,
        ReactiveFormsModule,
        ChatComponent


    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    miladitoderecho = signal([
        {
            ruta1: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
            nombre: 'la suc',
        },
        {
            ruta1: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
            nombre: 'ciona',
        },
        {
            ruta1: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
            nombre: 'por',
        },
        {
            ruta1: 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg',
            nombre: 'la noche',
        },
    ]);
    title = 'ShareHub';
    sesionUsuario: boolean = false

    ngOnInit() {
        this.publicacionesServices.getPublicaciones().subscribe((publicaciones) => {
            this.publicaciones = publicaciones;
          });
        if (sessionStorage.getItem("token") != null) {
            this.sesionUsuario = true
        } else {
            this.sesionUsuario = false
        }
        // console.log(this.sesionUsuario);
    }
    // ---------------------------------------------------Crear publicacion--------------------------------------------------------------
    // formPublicaciones: FormGroup;
    // private publicacionesServices = inject(SharehubApiService);
    // inputFile!: any
    // archivo: any

    // constructor(private fb: FormBuilder) {
    //     this.formPublicaciones = this.fb.group({
    //         TextPublicacion: ['', [Validators.required]],
    //         imgPublicacion: ['',]
    //     })
    // }

    // agregarImg(event: any) {
    //     if (event.target.files.length > 0) {
    //         const archivosPublicaciones = event.target.files[0]
    //         this.formPublicaciones.get("imgPublicacion")!.setValue(archivosPublicaciones)
    //     }
    // }

    // submitPublicacion() {

    //     const formDataPublicaciones = new FormData()
    //     formDataPublicaciones.append('textoPublicacion', this.formPublicaciones.get("textoPublicacion")!.value)
    //     formDataPublicaciones.append('imgPublicacion', this.formPublicaciones.get("imgPublicacion")!.value)

    //     this.publicacionesServices.postPublicacion(formDataPublicaciones).subscribe(
    //         (respuestaApi) => {
    //             Swal.fire({
    //                 title: "Publicacion creada correctamente!",
    //                 icon: "success"
    //             });
    //             console.log(respuestaApi)
    //         }, error => {
    //             Swal.fire({
    //                 title: "No se puedo realizar la publicacion",
    //                 icon: "error"
    //             });

    //         }
    //     )
    // }
    formPublicaciones: FormGroup;
    private publicacionesServices = inject(SharehubApiService);
    inputFile!: any;
    archivo: any;
    idUsuarioPayload!: string;
    tipoPublicacion!: boolean;
    publicaciones :any =[] ;

    constructor(private fb: FormBuilder) {
        this.formPublicaciones = this.fb.group({
            textPublicacion: [' ', [Validators.required]],
            imgPublicacion: [''],
        });
    }

    agregarImg(event: any) {
        if (event.target.files.length > 0) {
            const archivosPublicaciones = event.target.files[0];
            this.formPublicaciones
                .get('imgPublicacion')!
                .setValue(archivosPublicaciones);
        }
    }

    submitPublicacion() {
        console.log("---------",this.formPublicaciones)
        this.tipoPublicacion = true;
        if (this.formPublicaciones.valid) {
            const formDataPublicaciones = new FormData();
            formDataPublicaciones.append(
                'textPublicacion',
                this.formPublicaciones.get('textPublicacion')!.value
            );
            formDataPublicaciones.append(
                'imgPublicacion',
                this.formPublicaciones.get('imgPublicacion')!.value
            );
            formDataPublicaciones.append('idUsuario', this.idUsuarioPayload);
            formDataPublicaciones.append('tipoPublicacion', this.tipoPublicacion.toString());


            this.publicacionesServices
                .postPublicacion(formDataPublicaciones, true)
                .subscribe((respuestaApi) => {
                    Swal.fire({
                        title: 'Publicacion creada correctamente!',
                        icon: 'success',
                    });
                    console.log(respuestaApi);
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Ingresa los datos requeridos para crear la publicacion',
                icon: 'error',
            });
        }
    }

    payloadInfo() {
        console.log('holi');

        let tokenSession = sessionStorage.getItem('token');
        this.publicacionesServices
            .postDesencriptarPayload(tokenSession)
            .subscribe((respuestaApi: any) => {
                console.log(respuestaApi);
                this.idUsuarioPayload = respuestaApi.id;
            });
    }

}
