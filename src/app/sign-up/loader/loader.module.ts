import { CircleLoaderComponent } from './circle-loader/circle-loader.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    CircleLoaderComponent
  ]
})
export class LoaderModule { }
