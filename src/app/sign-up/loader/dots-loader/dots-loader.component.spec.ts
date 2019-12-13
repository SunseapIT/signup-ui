import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DotsLoaderComponent } from './dots-loader.component';

describe('DotsLoaderComponent', () => {
  let component: DotsLoaderComponent;
  let fixture: ComponentFixture<DotsLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DotsLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DotsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
