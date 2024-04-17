import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharehubApiService {
    private http = inject(HttpClient);
    private urlApi: string = 'http://54.173.19.90:4000/api';
    private publicacionesGrupos: BehaviorSubject<any[]> = new BehaviorSubject<
        any[]
    >([]);
    private publicacionesInicio: BehaviorSubject<any[]> = new BehaviorSubject<
        any[]
    >([]);

    constructor() {}

    //   -------------------------- SERVICE NAVBAR --------------------------
    buscarUsuarios(palabraClave: string) {
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('token')}`
        );
        return this.http.get(`${this.urlApi}/buscar-usuarios/${palabraClave}`, {
            headers,
        });
    }
    //   -------------------------- SERVICE GRUPOS --------------------------

    getGrupos() {
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('token')}`
        );
        return this.http.get(this.urlApi + '/consultar-grupos', { headers });
    }

    getUnGrupo(grupoId: string | null) {
        return this.http.get(`${this.urlApi}/consultar-grupo/${grupoId}`);
    }

    postGrupo(dataGrupo: any) {
        return this.http.post(`${this.urlApi}/crear-grupo/grupo`, dataGrupo);
    }

    deleteGrupo(grupoId: string) {
        return this.http.delete(`${this.urlApi}/eliminar-grupo/${grupoId}`);
    }

    putGrupo(grupoId: string | null, dataGrupo: any) {
        return this.http.put(
            `${this.urlApi}/actualizar-grupo/${grupoId}/grupo`,
            dataGrupo
        );
    }

    eliminarMiembroDeDB(idMiembro: string, idGrupo: any) {
        return this.http.delete(
            `${this.urlApi}/eliminar-miembro/${idMiembro}/${idGrupo}`
        );
    }

    // postPublicacionEnGrupo(dataPublicacion: any) {
    //     return this.http.post(
    //         `${this.urlApi}/crear-publicacion/publicacion`,
    //         dataPublicacion
    //     );
    // }

    getPublicacionesGrupo() {
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('token')}`
        );
        return this.http.get(this.urlApi + '/consultar-publicaciones-grupo', {
            headers,
        });
    }

    //   -------------------------- SERVICE USUARIOS --------------------------
    getUsuario(CorreoUser: string) {
        return this.http.get(`${this.urlApi}/consultar-usuario/${CorreoUser}`);
    }
    getUsuarios() {
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('token')}`
        );
        return this.http.get(`${this.urlApi}/consultar-usuarios`, { headers });
    }

    postusuario(datausuario: any) {
        return this.http.post(`${this.urlApi}/crear-usuario`, datausuario);
    }

    deleteUsuario(idusuario: string) {
        return this.http.delete(`${this.urlApi}/eliminar-usuario/${idusuario}`);
    }

    putUsuario(idusuario: string, dataUser: any) {
        return this.http.put(
            `${this.urlApi}/actualizar-usuario/${idusuario}/perfil`,
            dataUser
        );
    }
    putUsuarioSolito(idusuario: string, dataUser: any) {
        return this.http.put(
            `${this.urlApi}/actualizar-usuario/${idusuario}`,
            dataUser
        );
    }

    postDesencriptarPayload(token: string | null): any {
        if (token != null) {
            const headers = new HttpHeaders().set(
                'Authorization',
                `Beares ${token}`
            );
            return this.http.get(this.urlApi + '/token-info', { headers });
        } else {
            return { msg: 'sin token' };
        }
    }
    //   -------------------------- SERVICE PUBLICACIONES --------------------------

    // getPublicacionesGrupos(): Observable<any[]> {
    //     return this.publicacionesGrupos.asObservable();
    // }

    // getPublicacionesInicio(): Observable<any[]> {
    //     return this.publicacionesInicio.asObservable();
    // }
    // postPublicacion(dataPublicacion: any) {
    //     return this.http.post(
    //         `${this.urlApi}/crear-publicacion/publicacion`,
    //         dataPublicacion
    //     );
    // }

    postPublicacion(dataPublicacion: any, tipoPublicacion: boolean) {
        return this.http
            .post(`${this.urlApi}/crear-publicacion/publicacion`, dataPublicacion)
            .pipe(
                tap((respuesta) => {
                    if (tipoPublicacion === false) {
                        const publicacionesGrupos =
                            this.publicacionesGrupos.getValue();
                        publicacionesGrupos.push(respuesta);
                        this.publicacionesGrupos.next(publicacionesGrupos);
                    } else {
                        const publicacionesInicio =
                            this.publicacionesInicio.getValue();
                        publicacionesInicio.push(respuesta);
                        this.publicacionesInicio.next(publicacionesInicio);
                    }
                })
            );
    }

    deletePublicacion(publicacionId: string) {
        return this.http.delete(
            `${this.urlApi}/eliminar-publicacion/${publicacionId}`
        );
    }

    getPublicaciones() {
        const headers = new HttpHeaders().set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('token')}`
        );
        return this.http.get(this.urlApi + '/consultar-publicaciones', {
            headers,
        });
    }
    getUnaPublicacion(publicacionId: string) {
        return this.http.get(
            `${this.urlApi}/consultar-publicacion/${publicacionId}`
        );
    }
    getPublicacionesUsuario(idUsuario: string) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${sessionStorage.getItem('token')}`)
        return this.http.get(`${this.urlApi}/consultar-publicaciones-usuario/${idUsuario}`, {headers});
    }
    putPublicacion(publicacionId: string, dataPublicacion:any) {
        return this.http.put(`${this.urlApi}/actualizar-publicacion/${publicacionId}/publicacion`, dataPublicacion)
    }
    //   -------------------------- TOKEN VALIDATION --------------------------
    estaLogueado(): boolean {
        let estado = sessionStorage.getItem('token') ? true : false;
        return estado;
    }

    postIngresoUsuario(dataLogin: any) {
        return this.http.post(`${this.urlApi}/ingreso`, dataLogin);
    }
}
