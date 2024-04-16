import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-menu-izquierda',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink
    ],
    templateUrl: './menu-izquierda.component.html',
    styleUrl: './menu-izquierda.component.css'
})
export class MenuIzquierdaComponent {

}
