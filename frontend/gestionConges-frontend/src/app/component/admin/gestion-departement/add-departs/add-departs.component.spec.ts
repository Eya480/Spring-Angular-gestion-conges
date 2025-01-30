import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepartsComponent } from './add-departs.component';

describe('AddDepartsComponent', () => {
  let component: AddDepartsComponent;
  let fixture: ComponentFixture<AddDepartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDepartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDepartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
