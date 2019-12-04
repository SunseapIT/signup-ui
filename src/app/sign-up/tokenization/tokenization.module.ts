
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenizationPageComponent } from './tokenization-page/tokenization-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [TokenizationPageComponent]
})
export class TokenizationModule { }
