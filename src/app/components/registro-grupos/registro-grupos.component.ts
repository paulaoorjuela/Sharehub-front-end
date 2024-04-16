import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { SharehubApiService } from '../../services/sharehub-api.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
    selector: 'app-registro-grupos',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './registro-grupos.component.html',
    styleUrl: './registro-grupos.component.css',
})
export class RegistroGruposComponent {
    formGrupos: FormGroup;
    idUsuarioPayload!: string;
    private GruposServices = inject(SharehubApiService);
    inputFile!:any
    archivo:any

    constructor(private fb: FormBuilder, private router: Router) {
        this.formGrupos = this.fb.group({
            nombreGrupo: ['', [Validators.required]],
            descripcionGrupo: [''],
            imgGrupo: [''],
            // miembros: ['']
        });
    }

    ngOnInit(){
        if (sessionStorage.getItem('token') == null) {
            this.router.navigate(['']);
        }
    }

    agregarImagenArr(event:any){
        if(event.target.files.length > 0){
            const archivoGrupo = event.target.files[0]
            this.formGrupos.get("imgGrupo")!.setValue(archivoGrupo)
        }
    }


    submitForm() {
        let tokenSession = sessionStorage.getItem('token');
        this.GruposServices.postDesencriptarPayload(tokenSession).subscribe(
            (respuestaApi: any) => {
                console.log("respuesta api id --- ", respuestaApi.id);
                this.idUsuarioPayload = respuestaApi.id;
                this.GruposServices.getUsuario(respuestaApi.id).subscribe({
                    next: (respuestaApi: any) => {
                        console.log("respuesta api --- Objeto Usuario ", respuestaApi);
                    },
                    error: (err) => {
                        console.log(err);
                    },
                });

                // Llenar la clave miembros con el ID del usuario en el objeto FormData
                this.submitFormData();
            }
        );
    }

    private submitFormData() {
        if (this.formGrupos.valid) {
            const formDataGrupos = new FormData();
            formDataGrupos.append('nombreGrupo', this.formGrupos.get('nombreGrupo')!.value);
            formDataGrupos.append('descripcionGrupo', this.formGrupos.get('descripcionGrupo')!.value);
            formDataGrupos.append('imgGrupo', this.formGrupos.get('imgGrupo')!.value);

            // Llenar la clave miembros con el ID del usuario en el objeto FormData
            formDataGrupos.append('miembros', this.idUsuarioPayload);

            this.GruposServices.postGrupo(formDataGrupos).subscribe(
                (respuestaAPI) => {
                    Swal.fire({
                        title: 'Grupo creado correctamente!',
                        icon: 'success',
                    });
                    console.log(respuestaAPI);
                }
            );
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Por favor, ingresa los datos requeridos para crear un grupo',
                icon: 'error',
            });
        }
    }

    // submitForm() {
    //     let tokenSession = sessionStorage.getItem('token');
    //     this.GruposServices.postDesencriptarPayload(tokenSession).subscribe(
    //         (respuestaApi: any) => {
    //             console.log("respuesta api id --- ", respuestaApi.id);
    //             this.idUsuarioPayload = respuestaApi.id;
    //             this.GruposServices.getUsuario(respuestaApi.id).subscribe({
    //                 next: (respuestaApi: any) => {
    //                     console.log("respuesta api --- Objeto Usuario ", respuestaApi);
    //                 },
    //                 error: (err) => {
    //                     console.log(err);
    //                 },
    //             });
    //         }
    //     );


    //     if (this.formGrupos.valid) {
    //         const formDataGrupos = new FormData();
    //         formDataGrupos.append('nombreGrupo', this.formGrupos.get('nombreGrupo')!.value);
    //         formDataGrupos.append('descripcionGrupo', this.formGrupos.get('descripcionGrupo')!.value);
    //         formDataGrupos.append('imgGrupo', this.formGrupos.get('imgGrupo')!.value);
    //         formDataGrupos.append('miembros', this.formGrupos.get( this.idUsuarioPayload ));


    //         this.GruposServices.postGrupo(formDataGrupos).subscribe(
    //             (respuestaAPI) => {
    //                 Swal.fire({
    //                     title: 'Grupo creado correctamente!',
    //                     icon: 'success',
    //                 });
    //                 console.log(respuestaAPI);
    //             }
    //         );
    //     } else {
    //         Swal.fire({
    //             title: 'Error',
    //             text: 'por favor ingresa los datos requeridos para crear un grupo',
    //             icon: 'error',
    //         });
    //     }
    // }

}
