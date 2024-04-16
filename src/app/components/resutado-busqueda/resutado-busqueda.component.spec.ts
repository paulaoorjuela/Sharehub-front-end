import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResutadoBusquedaComponent } from './resutado-busqueda.component';

describe('ResutadoBusquedaComponent', () => {
  let component: ResutadoBusquedaComponent;
  let fixture: ComponentFixture<ResutadoBusquedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResutadoBusquedaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResutadoBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
