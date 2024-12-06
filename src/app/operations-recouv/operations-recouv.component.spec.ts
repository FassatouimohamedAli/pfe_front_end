import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationsRecouvComponent } from './operations-recouv.component';

describe('OperationsRecouvComponent', () => {
  let component: OperationsRecouvComponent;
  let fixture: ComponentFixture<OperationsRecouvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OperationsRecouvComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationsRecouvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
