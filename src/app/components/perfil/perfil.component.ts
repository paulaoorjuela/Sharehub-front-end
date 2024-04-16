import { Component, SimpleChanges, inject, signal } from '@angular/core';
import { SharehubApiService } from '../../services/sharehub-api.service';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersInterface } from '../../interface/users-interface';
import Swal from 'sweetalert2';
import { HijoInicioComponent } from '../hijo-inicio/hijo-inicio.component';

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        HijoInicioComponent
    ],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.css',
})
export class PerfilComponent {
    formPerfil: FormGroup;
    private PerfilServices = inject(SharehubApiService);
    listadoDeUsuarios = signal<any>([]);
    publicacionesDataUsuario:any = []
    idPerfilUrl: any;
    usuario!: string
    nombre: string = '';
    CorreoUser: string = '';
    clave: string = '';
    imguser: string = '';
    descripcionuser: string = '';
    _id: string = "";
    idPersonaSesion: string = "";
    idUsuarioPayload!: string;
    verificarIDUsuario: boolean = false;
    mostrarInput: boolean = false;
    idURL: any;
    publicaciones: any;

    inputHiddenID = new FormControl();

    constructor(private fb: FormBuilder, private rutaId: ActivatedRoute) {
        this.formPerfil = this.fb.group({
            nombre: ['', [Validators.required]],
            descripcionuser: [''],
            imguser: [''],
            idHidden: [''],
        });

        this.idPerfilUrl = this.rutaId.snapshot.paramMap.get('idPerfil');
    }

    agregarImagenArr(event: any) {
        if (event.target.files.length > 0) {
            const archivoUser = event.target.files[0];
            this.formPerfil.get('imguser')!.setValue(archivoUser);
        }
    }

    ngOnInit(): void {
        this.rutaId.paramMap.subscribe(params => {
            this.idURL = params.get('id');
            this.PerfilServices.getUsuario(this.idPerfilUrl).subscribe({
                next: (perfil: any) => {
                    let perfilData: UsersInterface = perfil;
                    this.nombre = perfilData.nombre;
                    this.CorreoUser = perfilData.CorreoUser;
                    this.clave = perfilData.clave;
                    this.imguser = perfilData.imguser;
                    this.descripcionuser = perfilData.descripcionuser;
                    this._id = perfilData._id;
                    this.cargarPublicacionesUsuario();
                    this.tokenUsuario()

                },
                error: (err) => {
                    console.log(err);
                },
            });
        });
    }

    async cargarPublicacionesUsuario() {
        console.log("---------------------");
        let tokenSession = sessionStorage.getItem('token');
        let respuestaApi = await this.PerfilServices.postDesencriptarPayload(tokenSession).toPromise();
        let idUsuario = respuestaApi.id;
        this.PerfilServices.getPublicacionesUsuario(this.idPerfilUrl).subscribe({
            next: (publicaciones: any) => {
                this.publicaciones = publicaciones;
                console.log("---------------------------");
                console.log(publicaciones);
                console.log("---------------------------");
                console.log("---------------------------");

            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    actualizarPublicacionX(idPublicacion: string) {
        this.PerfilServices.getUnaPublicacion(idPublicacion).subscribe({
            next: (publicacion) => {
                let dataPublicacion: any = publicacion;
                this.usuario = dataPublicacion._id;
                console.log(`objeto de publicacion ${dataPublicacion._id}`);
                console.log(`idUsuario creo publicacion ${dataPublicacion.idUsuario}`);

                if (dataPublicacion.imagenPublicacion == null) {
                    dataPublicacion.imagenPublicacion = ''
                }
                if (dataPublicacion.comentario == null || dataPublicacion.comentario == undefined) {
                    dataPublicacion.comentario = ''
                }

                this.formPerfil.setValue({
                    textPublicacion: '',
                    imgPublicacion: '',
                    comentario: ''
                })

            },
            error: (err) => {
                console.log(err);
            },
        })
    }

    consultarPublicaciones() {
        this.PerfilServices.getPublicaciones().subscribe({
            next: (publicaciones2) => {
                this.publicaciones.set(publicaciones2)
                console.log(this.publicaciones());

            }, error: (err) => {
                console.log(err);
            }
        })
    }

    async eliminarPublicacion(idPublicacion: string) {
        let tokenSession = sessionStorage.getItem('token');
        let respuestaApi: any;
        let respuesta: any;

        try {
            respuestaApi = await this.PerfilServices.postDesencriptarPayload(tokenSession).toPromise();
            this.idUsuarioPayload = respuestaApi.id;
            // console.log(`${this.idUsuarioPayload} respuestaApi.id | idUsuarioPayload logueado`);

            respuesta = await this.PerfilServices.getUnaPublicacion(idPublicacion).toPromise();
            this.usuario = respuesta.idUsuario;
            // console.log(`${this.usuario} id de usuario que creo la publicacion`);

            if (this.idUsuarioPayload == this.usuario) {
                let mensaje = "Tenga en cuenta que al eliminar esta publicacion no se podrá restablecer";
                // console.log(idPublicacion);

                const result = await Swal.fire({
                    title: "¿Estás seguro que quieres eliminar esta publicacion?",
                    icon: "question",
                    text: mensaje,
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, eliminar!",
                    cancelButtonText: "No, cancelar!",
                });

                if (result.isConfirmed) {
                    await this.PerfilServices.deletePublicacion(idPublicacion).toPromise();
                    Swal.fire({
                        title: "Publicacion eliminada correctamente!",
                        icon: "success"
                    });
                    this.consultarPublicaciones();
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }
            } else {
                Swal.fire({
                    title: "Solo puede eliminar quien la creo!",
                    icon: "error"
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    toggleInput() {
        this.mostrarInput = !this.mostrarInput;
    }

    submitPublicacionEditada(idPublicacion: string) {
        console.log(idPublicacion);

        console.log("-----++----", this.formPerfil)
        if (this.formPerfil.valid) {
            const formDataPublicaciones = new FormData();
            formDataPublicaciones.append('textPublicacion', this.formPerfil.get('textPublicacion')!.value);
            formDataPublicaciones.append('imgPublicacion', this.formPerfil.get('imgPublicacion')!.value);
            formDataPublicaciones.append('comentario', this.formPerfil.get('textPublicacion')!.value);

            const imgPublicacionFile = this.formPerfil.get('imgPublicacion')!.value
            console.log("🚀 ~ HijoInicioComponent ~ imgPublicacionFile:", imgPublicacionFile)
            if (imgPublicacionFile != "") {
                formDataPublicaciones.append('imgPublicacion', imgPublicacionFile)
            }
            console.log('Entro en actualizar');

            this.PerfilServices
                .putPublicacion(idPublicacion, formDataPublicaciones)
                .subscribe((respuestaApi) => {
                    Swal.fire({
                        title: 'Publicacion editada correctamente!',
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
                text: 'Ingresa los datos requeridos para editar la publicacion',
                icon: 'error',
            });
        }
    }

    submitFormEditar() {
        if (this.formPerfil.valid) {

            const formData: any = new FormData();
            formData.append('nombre', this.formPerfil.get('nombre')!.value);
            formData.append('descripcionuser', this.formPerfil.get('descripcionuser')!.value);
            formData.append('idHidden', this.formPerfil.get('idHidden')!.value);

            const imguserFile = this.formPerfil.get('imguser')!.value;
            if (imguserFile != "") {
                formData.append('imguser', imguserFile);
            } else {
                formData.append('imguser', "");
            }


            console.log(formData);
            this.PerfilServices.putUsuario(this.formPerfil.value.idHidden, formData).subscribe((respuestaAPI) => {
                console.log(this.formPerfil.value.idHidden);
                console.log(formData);


                Swal.fire({
                    title: 'Perfil actualizado correctamente!',
                    icon: 'success',
                });
                setTimeout(() => {
                    location.reload()
                }, 1000);
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingresa los datos requeridos para actualizar el perfil',
                icon: 'error',
            });
        }
    }

    actualizarPerfil(usuarioId: string) {
        this.PerfilServices.getUsuario(usuarioId).subscribe({
            next: (perfil) => {
                let dataUsuario: any = perfil;

                this._id = dataUsuario._id;

                if (dataUsuario.descripcionuser == null) {
                    dataUsuario.descripcionuser = '';
                }
                if (dataUsuario.imguser == null) {
                    dataUsuario.imguser = '';
                }

                this.formPerfil.setValue({
                    nombre: dataUsuario.nombre,
                    // CorreoUser: dataUsuario.CorreoUser,
                    // clave: dataUsuario.clave,
                    imguser: '',
                    descripcionuser: dataUsuario.descripcionuser,
                    idHidden: dataUsuario._id,

                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }



    tokenUsuario() {
        let tokenSession = sessionStorage.getItem('token');
        this.PerfilServices
            .postDesencriptarPayload(tokenSession)
            .subscribe((respuestaApi: any) => {
                this.idPersonaSesion = respuestaApi.id;
                this.verificarIDUsuario = (this.idPersonaSesion == this._id) ? true : false
            });
    }


}
