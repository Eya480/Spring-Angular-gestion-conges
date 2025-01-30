import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeCongesComponent } from './add-type-conges.component';

describe('AddTypeCongesComponent', () => {
  let component: AddTypeCongesComponent;
  let fixture: ComponentFixture<AddTypeCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTypeCongesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
