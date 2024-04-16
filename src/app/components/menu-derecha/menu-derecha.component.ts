import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharehubApiService } from '../../services/sharehub-api.service';
import { ActivatedRoute } from '@angular/router';
import { UsersInterface } from '../../interface/users-interface';
import Swal from 'sweetalert2';
import { max } from 'rxjs';

@Component({
    selector: 'app-menu-derecha',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './menu-derecha.component.html',
    styleUrl: './menu-derecha.component.css',
})
export class MenuDerechaComponent {
    private seviceUser = inject(SharehubApiService)
    userdata = signal<any>([])
    formPerfil: FormGroup;




    nombre: string = '';
    CorreoUser: string = '';
    clave: string = '';
    imguser: string = '';
    descripcionuser: string = '';
    _id: string = "";
    listaUsuarios: any = [];
    usuariosfiltre: any = [];
    listaMiembros: any = [];
    IdUsuario: any;
    idURL: any




    idPersonaSesion: string = ""
    verificarIDUsuario: boolean = false


    constructor(private fb: FormBuilder, private rutaId: ActivatedRoute) {
        this.formPerfil = this.fb.group({

            amigos: ['']
        });


        this.IdUsuario = this.rutaId.snapshot.paramMap.get('idPerfil');
        console.log(this.IdUsuario);

    }


    // submitPublicacion() {
    //     if (this.formPublicaciones.valid) {
    //         const formDataPublicaciones = new FormData();
    //         formDataPublicaciones.append(
    //             'textPublicacion',
    //             this.formPublicaciones.get('textPublicacion')!.value
    //         );
    //         formDataPublicaciones.append(
    //             'imgPublicacion',
    //             this.formPublicaciones.get('imgPublicacion')!.value
    //         );
    //         formDataPublicaciones.append('idUsuario', this.idUsuarioPayload);

    ngOnInit() {

        this.seviceUser.getUsuarios().subscribe({
            next: (usuarios: any) => {



                this.listaUsuarios = usuarios;
                this.usuariosfiltre = usuarios.slice(0,6)





                console.log(this.usuariosfiltre);
            },
            error: (err) => {
                console.log(err);
            },
        });


        let tokenSession = sessionStorage.getItem('token');
        this.seviceUser.postDesencriptarPayload(tokenSession).subscribe(
            (respuestaApi: any) => {
                this.IdUsuario = respuestaApi.id;
                this.seviceUser.getUsuario(respuestaApi.id).subscribe({
                    next: (respuestaApi: any) => {
                        this.imguser = respuestaApi.imguser;
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });
            }
        );

        this.seviceUser
            .postDesencriptarPayload(tokenSession)
            .subscribe((respuestaApi: any) => {
                console.log(respuestaApi);
                this.IdUsuario = respuestaApi.id;
                // this.router.navigate([`/mi-perfil/${this.idUsuarioPayload}`])
            });
    }
    addAmigo(amigo: string) {

        this.seviceUser.getUsuario(this.IdUsuario).subscribe({
            next: (usuarios: any) => {
                const formData: any = new FormData();
                // usuarios.amigos.push(amigo);
                const filtro = usuarios.amigos.includes(amigo)
                console.log(filtro);
                if (filtro == false) {



                    this.seviceUser.getUsuario(this.IdUsuario).subscribe({
                        next: (usuarios: any) => {
                            const formData: any = new FormData();
                            usuarios.amigos.push(amigo);
                            formData.append('amigos', usuarios.amigos);
                            this.seviceUser.putUsuario(
                                this.IdUsuario,
                                formData).subscribe({
                                    next: () => {
                                        console.log(usuarios);
                                        this.seviceUser.getUsuario(amigo).subscribe({
                                            next: (depronto: any) => {
                                                console.log(depronto);
                                                Swal.fire({
                                                    title: `${depronto.nombre} y ${usuarios.nombre}, Ahora son amigos`,
                                                    icon: 'success'
                                                });
                                            }
                                        })
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

                } else {
                    this.seviceUser.getUsuario(amigo).subscribe({
                        next: (depronto: any) => {
                            console.log(depronto);
                            Swal.fire({
                                title: `${depronto.nombre} y ${usuarios.nombre},     Ya son amigos`,
                                icon: "error"
                            });
                        }
                    })
                }
            },
            error: (err) => {
                console.log(err);
            },
        });
    }


}
