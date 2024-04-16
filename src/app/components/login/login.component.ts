import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharehubApiService } from '../../services/sharehub-api.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ReactiveFormsModule
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    ingreso: FormGroup;
    inputCorreo = new FormControl()
    inputClave = new FormControl()
    private SharehubApiServices = inject(SharehubApiService)

    ingresoUsuario() {
        let CorreoUser = this.inputCorreo.value
        let clave = this.inputClave.value
        this.SharehubApiServices.postIngresoUsuario({CorreoUser, clave}).subscribe(data =>{
            console.log(data);
            let dataApi:any = data
            sessionStorage.setItem('token', dataApi.token)
            location.reload()

        }, err => {
            console.log(err);
            Swal.fire({
                title: 'Ingrese los datos correctamente!',
                icon: 'error',
            });

        }
        )
    }


    constructor(private router: Router, private fb: FormBuilder){

        this.ingreso = this.fb.group({
            contrasena:["",[Validators.required,Validators.minLength(6)]],
            usuario:["",[Validators.required,Validators.minLength(6)]]

        })
    }
    ingresar(){
        console.log(this.ingreso);
    }


    ngOnInit(){
        if(sessionStorage.getItem("token") != null){
            this.router.navigate(['/inicio'])
        }

    }
}

