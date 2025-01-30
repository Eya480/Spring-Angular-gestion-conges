import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDepartsComponent } from './list-departs.component';

describe('ListDepartsComponent', () => {
  let component: ListDepartsComponent;
  let fixture: ComponentFixture<ListDepartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDepartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDepartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
