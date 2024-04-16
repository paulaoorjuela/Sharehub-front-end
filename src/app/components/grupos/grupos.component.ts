import { Component, Input, inject, signal } from '@angular/core';
import { SharehubApiService } from '../../services/sharehub-api.service';
import { CommonModule } from '@angular/common';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GruposInterface } from '../../interface/grupos-interface';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-grupos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './grupos.component.html',
    styleUrl: './grupos.component.css',
})
export class GruposComponent {
    formGrupos: FormGroup;
    formPublicaciones: FormGroup;
    private GruposServices = inject(SharehubApiService);
    listadoDeGrupos = signal<any>([]);
    listaUsuarios: any = [];
    listaMiembros: any = [];
    idGrupoUrl: null | string;

    @Input() rutaImagenUsuario!: string;
    @Input() rutaNombre!: string;
    @Input() rutaImagen!: string;
    @Input() rutaComentario!: string;
    // @Input () rutaId!: string
    @Input() rutaTexto!: string;
    @Input() idUsuario!: string;

    usuario!: string;
    nombreGrupo: string = '';
    descripcionGrupo: string = '';
    imgGrupo: string = '';
    _id: string = '';

    mostrarInput: boolean = false;
    inputFile!: any;
    archivo: any;
    idUsuarioPayload!: string;
    tipoPublicacion!: boolean;
    publicaciones: any = [];
    publicacionesDataUsuario: any = [];
    inputHiddenID = new FormControl();

    constructor(
        private fb: FormBuilder,
        private rutaId: ActivatedRoute,
        private router: Router
    ) {
        this.formGrupos = this.fb.group({
            nombreGrupo: ['', [Validators.required]],
            descripcionGrupo: [''],
            imgGrupo: [''],
            idHidden: [''],
        });

        this.idGrupoUrl = this.rutaId.snapshot.paramMap.get('idGrupo');

        this.formPublicaciones = this.fb.group({
            textPublicacion: [' ', [Validators.required]],
            imgPublicacion: [''],
        });
    }

    toggleInput() {
        this.mostrarInput = !this.mostrarInput;
    }

    agregarImagenArr(event: any) {
        if (event.target.files.length > 0) {
            const archivoGrupo = event.target.files[0];
            this.formGrupos.get('imgGrupo')!.setValue(archivoGrupo);
        }
    }

    ngOnInit(): void {
        this.GruposServices.getPublicacionesGrupo().subscribe(
            (publicaciones) => {
                this.publicaciones = publicaciones;
            }
        );
        if (sessionStorage.getItem('token') == null) {
            this.router.navigate(['/']);
        }
        this.GruposServices.getUnGrupo(this.idGrupoUrl).subscribe({
            next: (grupos: any) => {
                let gruposData: GruposInterface = grupos;
                this.nombreGrupo = gruposData.nombreGrupo;
                this.descripcionGrupo = gruposData.descripcionGrupo;
                this.imgGrupo = gruposData.imgGrupo;
                this._id = gruposData._id;
            },
            error: (err) => {
                console.log(err);
            },
        });

        console.log('Se inicio el componente');
    }

    submitFormEditar() {
        if (this.formGrupos.valid) {
            const formData: any = new FormData();
            formData.append(
                'nombreGrupo',
                this.formGrupos.get('nombreGrupo')!.value
            );
            formData.append(
                'descripcionGrupo',
                this.formGrupos.get('descripcionGrupo')!.value
            );
            formData.append('idHidden', this.formGrupos.get('idHidden')!.value);

            const imgGrupoFile = this.formGrupos.get('imgGrupo')!.value;
            if (imgGrupoFile != '') {
                formData.append('imgGrupo', imgGrupoFile);
            } else {
                formData.append('imgGrupo', '');
            }

            console.log('Entro en actualizar');
            this.GruposServices.putGrupo(
                this.formGrupos.value.idHidden,
                formData
            ).subscribe((respuestaAPI) => {
                Swal.fire({
                    title: 'Grupo actualizado correctamente!',
                    icon: 'success',
                });
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingresa los datos requeridos para actualizar el grupo',
                icon: 'error',
            });
        }
    }

    actualizarGrupo(grupoId: string) {
        this.GruposServices.getUnGrupo(grupoId).subscribe({
            next: (grupo) => {
                let dataGrupo: any = grupo;

                this._id = dataGrupo._id;

                if (dataGrupo.descripcionGrupo == null) {
                    dataGrupo.descripcionGrupo = '';
                }
                if (dataGrupo.imgGrupo == null) {
                    dataGrupo.imgGrupo = '';
                }

                this.formGrupos.setValue({
                    nombreGrupo: dataGrupo.nombreGrupo,
                    descripcionGrupo: dataGrupo.descripcionGrupo,
                    imgGrupo: '',
                    idHidden: dataGrupo._id,
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    // -------------------------------------- Agregar miembros -------------------------------------------
    obtenerUsuarios() {
        this.GruposServices.getUsuarios().subscribe({
            next: (usuarios: any) => {
                console.log(usuarios);
                this.listaUsuarios = usuarios;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    agregarMiembro(idUsuario: string) {
        this.GruposServices.getUnGrupo(this.idGrupoUrl).subscribe({
            next: (grupo: any) => {
                let dataConsultaGrupo = grupo;
                const formData: any = new FormData();
                formData.append('imgGrupo', '');
                formData.append('nombreGrupo', dataConsultaGrupo.nombreGrupo);
                formData.append(
                    'descripcionGrupo',
                    dataConsultaGrupo.descripcionGrupo
                );
                if (dataConsultaGrupo.miembros.indexOf(idUsuario) == -1) {
                    dataConsultaGrupo.miembros.push(idUsuario);
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'Este miembro ya hace parte del grupo',
                        icon: 'error',
                    });
                    return;
                }
                formData.append('miembros', dataConsultaGrupo.miembros);
                this.GruposServices.putGrupo(
                    this.idGrupoUrl,
                    formData
                ).subscribe({
                    next: () => {
                        this.obtenerMiembrosEliminar();
                        Swal.fire({
                            title: 'Nuevo miembro agregado!',
                            icon: 'success',
                        });
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    // ----------------------------------- Eliminar miembros ---------------------------------
    obtenerMiembrosEliminar() {
        this.listaMiembros = [];
        this.GruposServices.getUnGrupo(this.idGrupoUrl).subscribe({
            next: (grupo: any) => {
                let dataConsultaGrupo = grupo;
                const arrListaMiembros = dataConsultaGrupo.miembros;
                console.log(grupo);

                arrListaMiembros.forEach((IDmiembro: any) => {
                    this.GruposServices.getUsuario(IDmiembro).subscribe({
                        next: (usuarioInfo: any) => {
                            console.log(IDmiembro);
                            this.listaMiembros.push(usuarioInfo);
                            console.log(usuarioInfo);

                            console.log('-----------', this.listaMiembros);
                        },
                        error: (err) => {
                            console.log(err);
                        },
                    });
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    eliminarMiembro(idUsuario: string) {
        // Obtener el índice del miembro en la lista
        const index = this.listaMiembros.findIndex(
            (miembro: any) => miembro._id === idUsuario
        );
        console.log(idUsuario);

        this.GruposServices.getUnGrupo(this.idGrupoUrl).subscribe({
            next: (grupo: any) => {
                let dataConsultaGrupo = grupo;
                const formData: any = new FormData();
                formData.append('imgGrupo', '');
                formData.append('nombreGrupo', dataConsultaGrupo.nombreGrupo);
                formData.append(
                    'descripcionGrupo',
                    dataConsultaGrupo.descripcionGrupo
                );
                if (index !== -1) {
                    // eliminar el miembro del array
                    this.listaMiembros.splice(index, 1);
                    console.log(this.listaMiembros);

                    // llamar a service para eliminar el miembro de la base de datos
                    this.GruposServices.eliminarMiembroDeDB(
                        idUsuario,
                        this.idGrupoUrl
                    ).subscribe({
                        next: (respuesta) => {
                            console.log(idUsuario);
                            console.log(
                                'Miembro eliminado de la base de datos:',
                                respuesta
                            );
                        },
                        error: (err) => {
                            console.log(err);
                        },
                    });
                } else {
                    console.log('No se encontró el miembro en la lista');
                }
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    // ----------------------------------- publicar en grupo ---------------------------------
    agregarImg(event: any) {
        if (event.target.files.length > 0) {
            const archivosPublicaciones = event.target.files[0];
            this.formPublicaciones
                .get('imgPublicacion')!
                .setValue(archivosPublicaciones);
        }
    }

    submitFormPublicar() {
        this.tipoPublicacion = false;
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

            let tokenSession = sessionStorage.getItem('token');
            let idUsuarioPublicacion = '';
            this.GruposServices.postDesencriptarPayload(tokenSession).subscribe(
                (respuestaApi: any) => {
                    idUsuarioPublicacion = respuestaApi.id;
                    console.log('------------');
                    console.log(idUsuarioPublicacion);
                    console.log('------------');

                    formDataPublicaciones.append(
                        'idUsuario',
                        idUsuarioPublicacion
                    );
                    formDataPublicaciones.append(
                        'tipoPublicacion',
                        this.tipoPublicacion.toString()
                    );

                    this.GruposServices.postPublicacion(
                        formDataPublicaciones,
                        false
                    ).subscribe((respuestaApi) => {
                        Swal.fire({
                            title: 'Publicacion creada correctamente!',
                            icon: 'success',
                        });
                        console.log(respuestaApi);
                        setTimeout(() => {
                            location.reload();
                        }, 2000);
                    });
                }
            );
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
        this.GruposServices.postDesencriptarPayload(tokenSession).subscribe(
            (respuestaApi: any) => {
                console.log(respuestaApi);
                this.idUsuarioPayload = respuestaApi.id;
            }
        );
    }

    // ----------------------------------- barra para navegar prupo ---------------------------------
    mostrarPublicaciones() {
        this.GruposServices.getPublicacionesGrupo().subscribe({
            next: (publicaciones2) => {
                this.publicaciones = publicaciones2;
                // console.log(this.publicaciones());

                this.publicaciones.forEach((publicacion: any) => {
                    console.log(publicacion);

                    if (publicacion.idUsuario != null) {
                        let idUsuarioPublicacion = publicacion.idUsuario;
                        this.GruposServices.getUsuario(
                            idUsuarioPublicacion
                        ).subscribe({
                            next: (dataUsuario: any) => {
                                publicacion.nombreUsuario = dataUsuario.nombre;
                                if (
                                    dataUsuario.imguser == '' ||
                                    dataUsuario.imguser == null
                                ) {
                                    publicacion.imgUsuario =
                                        'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';
                                } else {
                                    publicacion.imgUsuario =
                                        dataUsuario.imguser;
                                }
                            },
                        });
                        this.publicacionesDataUsuario.push(publicacion);
                        this.publicacionesDataUsuario.reverse();
                        // console.log(publicacion)
                    }
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    mostrarMiembros() {
        this.GruposServices.getUnGrupo(this.idGrupoUrl).subscribe({
            next: (grupo: any) => {
                let dataConsultaGrupo = grupo;
                this.listaMiembros = dataConsultaGrupo.miembros;
                this.listaMiembros.forEach(
                    (idUsuario: string, index: number) => {
                        this.GruposServices.getUsuario(idUsuario).subscribe({
                            next: (usuarioInfo: any) => {
                                this.listaMiembros[index] = {
                                    ...this.listaMiembros[index],
                                    nombre: usuarioInfo.nombre,
                                    imguser: usuarioInfo.imguser,
                                };
                                console.log(
                                    'Lista de miembros actualizada:',
                                    this.listaMiembros
                                );
                            },
                            error: (err) => {
                                console.log(err);
                            },
                        });
                    }
                );
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    actualizarPublicacionX(idPublicacion: string) {
        this.GruposServices.getUnaPublicacion(idPublicacion).subscribe({
            next: (publicacion) => {
                let dataPublicacion: any = publicacion;
                this.usuario = dataPublicacion._id;
                console.log(`objeto de publicacion ${dataPublicacion._id}`);
                console.log(
                    `idUsuario creo publicacion ${dataPublicacion.idUsuario}`
                );

                if (dataPublicacion.imagenPublicacion == null) {
                    dataPublicacion.imagenPublicacion = '';
                }
                if (
                    dataPublicacion.comentario == null ||
                    dataPublicacion.comentario == undefined
                ) {
                    dataPublicacion.comentario = '';
                }

                this.formPublicaciones.setValue({
                    textPublicacion: '',
                    imgPublicacion: '',
                    comentario: '',
                });
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    consultarPublicaciones() {
        // if(this.tipoPublicacion === true){
        this.GruposServices.getPublicaciones().subscribe({
            next: (publicaciones2) => {
                this.publicaciones.set(publicaciones2);
                console.log(this.publicaciones());
            },
            error: (err) => {
                console.log(err);
            },
        });
        // }
    }

    async eliminarPublicacion(idPublicacion: string) {
        let tokenSession = sessionStorage.getItem('token');
        let respuestaApi: any;
        let respuesta: any;

        try {
            respuestaApi = await this.GruposServices.postDesencriptarPayload(
                tokenSession
            ).toPromise();
            this.idUsuarioPayload = respuestaApi.id;
            // console.log(`${this.idUsuarioPayload} respuestaApi.id | idUsuarioPayload logueado`);

            respuesta = await this.GruposServices.getUnaPublicacion(
                idPublicacion
            ).toPromise();
            this.usuario = respuesta.idUsuario;
            // console.log(`${this.usuario} id de usuario que creo la publicacion`);

            if (this.idUsuarioPayload == this.usuario) {
                let mensaje =
                    'Tenga en cuenta que al eliminar esta publicacion no se podrá restablecer';
                // console.log(idPublicacion);

                const result = await Swal.fire({
                    title: '¿Estás seguro que quieres eliminar esta publicacion?',
                    icon: 'question',
                    text: mensaje,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminar!',
                    cancelButtonText: 'No, cancelar!',
                });

                if (result.isConfirmed) {
                    await this.GruposServices.deletePublicacion(
                        idPublicacion
                    ).toPromise();
                    Swal.fire({
                        title: 'Publicacion eliminada correctamente!',
                        icon: 'success',
                    });
                    this.consultarPublicaciones();
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                }
            } else {
                Swal.fire({
                    title: 'Solo puede eliminar quien la creo!',
                    icon: 'error',
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    submitPublicacionEditada(idPublicacion: string) {
        console.log(idPublicacion);

        console.log('-----++----', this.formPublicaciones);
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
            formDataPublicaciones.append(
                'comentario',
                this.formPublicaciones.get('textPublicacion')!.value
            );

            const imgPublicacionFile =
                this.formPublicaciones.get('imgPublicacion')!.value;
            console.log(
                '🚀 ~ HijoInicioComponent ~ imgPublicacionFile:',
                imgPublicacionFile
            );
            if (imgPublicacionFile != '') {
                formDataPublicaciones.append(
                    'imgPublicacion',
                    imgPublicacionFile
                );
            }
            console.log('Entro en actualizar');

            this.GruposServices.putPublicacion(
                idPublicacion,
                formDataPublicaciones
            ).subscribe((respuestaApi) => {
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
}
