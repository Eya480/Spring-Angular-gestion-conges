import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitoriqueCongesComponent } from './hitorique-conges.component';

describe('HitoriqueCongesComponent', () => {
  let component: HitoriqueCongesComponent;
  let fixture: ComponentFixture<HitoriqueCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HitoriqueCongesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitoriqueCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
