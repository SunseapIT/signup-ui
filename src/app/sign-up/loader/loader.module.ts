import { CircleLoaderComponent } from './circle-loader/circle-loader.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DotsLoaderComponent } from './dots-loader/dots-loader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    CircleLoaderComponent,
    DotsLoaderComponent
  ]
})
export class LoaderModule { }
