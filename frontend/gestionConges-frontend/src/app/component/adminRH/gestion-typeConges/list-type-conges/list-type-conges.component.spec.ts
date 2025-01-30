import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTypeCongesComponent } from './list-type-conges.component';

describe('ListTypeCongesComponent', () => {
  let component: ListTypeCongesComponent;
  let fixture: ComponentFixture<ListTypeCongesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTypeCongesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTypeCongesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
