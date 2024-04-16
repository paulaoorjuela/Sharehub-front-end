import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GruposListadoTemplateComponent } from '../templates/grupos-listado-template/grupos-listado-template.component';
import { SharehubApiService } from '../../services/sharehub-api.service';

@Component({
    selector: 'app-listado-grupos',
    standalone: true,
    imports: [GruposListadoTemplateComponent],
    templateUrl: './listado-grupos.component.html',
    styleUrl: './listado-grupos.component.css',
})
export class ListadoGruposComponent {
    gruposData = signal<any>([]);
    private GruposServices = inject(SharehubApiService);

    constructor(private router: Router) {}

    ngOnInit() {
        if (sessionStorage.getItem('token') == null) {
            this.router.navigate(['/']);
        }
        this.GruposServices.getGrupos().subscribe({
            next: (grupos) => {
                this.gruposData.set(grupos);
                console.log(this.gruposData());
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    GrupoDesdeTemplate(event: String, idGrupo: string) {
        console.log(event);
        console.log(idGrupo);
    }

    GrupoSelecionadoDesdeTemplate(data: { idGrupo: string, descripcionGrupo: string, nombreGrupo: string, imgGrupo: string }) {
        // navega hasta '/grupos' component con los datos del grupo
        this.router.navigate(['/grupos', data.idGrupo, { nombreGrupo: data.nombreGrupo, descripcionGrupo: data.descripcionGrupo, imgGrupo: data.imgGrupo }]);
    }
}
