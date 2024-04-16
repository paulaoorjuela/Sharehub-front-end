import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijoInicioComponent } from './hijo-inicio.component';

describe('HijoInicioComponent', () => {
    let component: HijoInicioComponent;
    let fixture: ComponentFixture<HijoInicioComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HijoInicioComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(HijoInicioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
