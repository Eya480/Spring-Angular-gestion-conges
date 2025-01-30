import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandesEnAttenteComponent } from './demandes-en-attente.component';

describe('DemandesEnAttenteComponent', () => {
  let component: DemandesEnAttenteComponent;
  let fixture: ComponentFixture<DemandesEnAttenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemandesEnAttenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemandesEnAttenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
