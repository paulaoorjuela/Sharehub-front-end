import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposListadoTemplateComponent } from './grupos-listado-template.component';

describe('GruposListadoTemplateComponent', () => {
  let component: GruposListadoTemplateComponent;
  let fixture: ComponentFixture<GruposListadoTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GruposListadoTemplateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GruposListadoTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
