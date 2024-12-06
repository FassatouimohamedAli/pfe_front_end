import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EchancierComponent } from './echancier.component';

describe('EchancierComponent', () => {
  let component: EchancierComponent;
  let fixture: ComponentFixture<EchancierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EchancierComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EchancierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
