import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGruposComponent } from './registro-grupos.component';

describe('RegistroGruposComponent', () => {
  let component: RegistroGruposComponent;
  let fixture: ComponentFixture<RegistroGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroGruposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistroGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
