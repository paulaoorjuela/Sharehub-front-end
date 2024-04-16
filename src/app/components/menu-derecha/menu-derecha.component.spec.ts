import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDerechaComponent } from './menu-derecha.component';

describe('MenuDerechaComponent', () => {
  let component: MenuDerechaComponent;
  let fixture: ComponentFixture<MenuDerechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDerechaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MenuDerechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
