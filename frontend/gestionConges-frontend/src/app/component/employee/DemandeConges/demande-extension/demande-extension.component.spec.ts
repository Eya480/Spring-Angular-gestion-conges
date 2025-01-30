import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandeExtensionComponent } from './demande-extension.component';

describe('DemandeExtensionComponent', () => {
  let component: DemandeExtensionComponent;
  let fixture: ComponentFixture<DemandeExtensionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandeExtensionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandeExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
