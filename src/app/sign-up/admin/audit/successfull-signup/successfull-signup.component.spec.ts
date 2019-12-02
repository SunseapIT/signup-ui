import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfullSignupComponent } from './successfull-signup.component';

describe('SuccessfullSignupComponent', () => {
  let component: SuccessfullSignupComponent;
  let fixture: ComponentFixture<SuccessfullSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessfullSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfullSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
