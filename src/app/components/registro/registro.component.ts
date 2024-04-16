import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharehubApiService } from '../../services/sharehub-api.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';




@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.css'
})
export class RegistroComponent {
    formregistro: FormGroup;
    private registroService = inject(SharehubApiService)
    regexEmail = /[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}/
    regexAlfabetico = /^[A-Za-z ]+$/

    constructor(private router: Router, private fb: FormBuilder) {
        this.formregistro = this.fb.group({
            nombre: ['', [Validators.required, Validators.pattern(this.regexAlfabetico)]],
            CorreoUser: ['', [Validators.required, Validators.pattern(this.regexEmail)]],
            clave: ['', [Validators.required]],
            imguser: [''],
            descripcionuser: ['']

        })
    }

    productosData = signal<any>([])
    private productosServices = inject(SharehubApiService)

    ngOnInit() {

        if (sessionStorage.getItem("token") != null || undefined) {
            this.router.navigate([''])
        };

    }
    submitForm() {
        if(this.formregistro.value.imguser == '' || this.formregistro.value.imguser  == null){
            this.formregistro.value.imguser = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg'
        }


        console.log(this.formregistro.value);
        this.registroService.postusuario(this.formregistro.value).subscribe(respuestaAPI => {



            Swal.fire({
                title: "Usuario creado correctamente!",
                icon: "success"
            });
            let dataApi: any = respuestaAPI
            console.log(respuestaAPI);
            setTimeout(() => {
                this.router.navigate([''])
            }, 2000);
        }, error => {
            Swal.fire({
                title: "El correo electronico ya existe!",
                icon: "error"
            });
        })
    }
}
