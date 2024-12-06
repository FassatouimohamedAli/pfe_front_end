import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenagementComponent } from './arrangement.component';

describe('AmenagementComponent', () => {
  let component: AmenagementComponent;
  let fixture: ComponentFixture<AmenagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AmenagementComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AmenagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
