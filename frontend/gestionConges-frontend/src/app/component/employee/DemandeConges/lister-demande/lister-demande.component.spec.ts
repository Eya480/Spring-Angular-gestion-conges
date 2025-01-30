import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerDemandeComponent } from './lister-demande.component';

describe('ListerDemandeComponent', () => {
  let component: ListerDemandeComponent;
  let fixture: ComponentFixture<ListerDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListerDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListerDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
