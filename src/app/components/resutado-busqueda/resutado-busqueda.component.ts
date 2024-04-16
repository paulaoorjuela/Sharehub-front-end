import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SharehubApiService } from '../../services/sharehub-api.service';

@Component({
    selector: 'app-resutado-busqueda',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './resutado-busqueda.component.html',
    styleUrl: './resutado-busqueda.component.css',
})
export class ResutadoBusquedaComponent {
    @Input () idUsuario!: string
    private Services = inject(SharehubApiService);
    busquedaParam: any = "";
    usuariosEncontrados:any = [];
    constructor(private ruta: ActivatedRoute) {
        let param = this.ruta.snapshot.paramMap.get('palabraClave');
        if(param != null){
            this.busquedaParam = param;
        }
    }

    ngOnInit() {
        if(this.busquedaParam != "" || this.busquedaParam != null) {
            if (this.busquedaParam.length >= 3) {
                this.Services.buscarUsuarios(this.busquedaParam).subscribe({
                    next: (usuarios: any) => {
                        this.usuariosEncontrados = usuarios;
                    },
                    error: (err) => {
                        console.error(err);
                    },
                });
            } else {
                this.usuariosEncontrados = [];
            }
        }
    }
}
