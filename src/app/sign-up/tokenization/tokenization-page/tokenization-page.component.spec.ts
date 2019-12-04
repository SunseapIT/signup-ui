import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenizationPageComponent } from './tokenization-page.component';

describe('TokenizationPageComponent', () => {
  let component: TokenizationPageComponent;
  let fixture: ComponentFixture<TokenizationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenizationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenizationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
