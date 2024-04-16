import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject, input } from '@angular/core';
import { SharehubApiService } from "../../../services/sharehub-api.service";
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-grupos-listado-template',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './grupos-listado-template.component.html',
    styleUrl: './grupos-listado-template.component.css',
})
export class GruposListadoTemplateComponent {
    private GruposServices = inject(SharehubApiService);
    @Input() nombreGrupo!: string;
    @Input() imgGrupo!: string;
    @Input() idGrupo!: string;
    @Input() descripcionGrupo!: string;

    @Output() dataGrupoTemplate = new EventEmitter();
    // @Output() grupoSeleccionado = new EventEmitter<{ idGrupo: string, descripcionGrupo: string, nombreGrupo: string, imgGrupo: string }>();


    // onGrupoSeleccionado() {
    //     // Emit el evento con los datos del grupo
    //     this.grupoSeleccionado.emit({ idGrupo:this.idGrupo, descripcionGrupo: this.descripcionGrupo, nombreGrupo: this.nombreGrupo, imgGrupo: this.imgGrupo });
    // }

    eliminarGrupo(idGrupo: string ) {
        Swal.fire({
            title: '¿estas seguro?',
            text: 'No podras restablecer los grupos eliminados',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.GruposServices.deleteGrupo(idGrupo).subscribe(
                    (response) => {
                        console.log(response);
                        Swal.fire({
                            title: 'Listo!',
                            text: 'El grupo ha sido eliminado',
                            icon: 'success',
                        });
                        setTimeout(() => {
                            location.reload()
                        }, 1500);
                        let dataGrupo = {
                            nombreGrupo: this.nombreGrupo,
                            imgGrupo: this.imgGrupo,
                        };
                        this.dataGrupoTemplate.emit(dataGrupo);
                    },
                    (error) => {
                        console.error(error);
                        Swal.fire({
                            title: 'Error',
                            text: 'No se ha podido eliminar el grupo, comunicate con los administradores',
                            icon: 'error',
                        });
                    }
                );
            }
        });
    }

    // consultarUnGrupo(idGrupo: String){


    // }
}
