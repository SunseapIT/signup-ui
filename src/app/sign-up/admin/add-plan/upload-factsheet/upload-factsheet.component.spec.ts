import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFactsheetComponent } from './upload-factsheet.component';

describe('UploadFactsheetComponent', () => {
  let component: UploadFactsheetComponent;
  let fixture: ComponentFixture<UploadFactsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFactsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFactsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
