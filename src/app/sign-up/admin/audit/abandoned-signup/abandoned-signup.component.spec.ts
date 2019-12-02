import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedSignupComponent } from './abandoned-signup.component';

describe('AbandonedSignupComponent', () => {
  let component: AbandonedSignupComponent;
  let fixture: ComponentFixture<AbandonedSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbandonedSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
