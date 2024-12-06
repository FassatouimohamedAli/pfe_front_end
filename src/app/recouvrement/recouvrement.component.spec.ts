import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecouvrementComponent } from './recouvrement.component';

describe('RecouvrementComponent', () => {
  let component: RecouvrementComponent;
  let fixture: ComponentFixture<RecouvrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecouvrementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecouvrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
