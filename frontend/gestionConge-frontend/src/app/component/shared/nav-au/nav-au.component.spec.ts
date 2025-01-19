import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAuComponent } from './nav-au.component';

describe('NavAuComponent', () => {
  let component: NavAuComponent;
  let fixture: ComponentFixture<NavAuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavAuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavAuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
