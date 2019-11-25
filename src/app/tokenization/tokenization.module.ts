import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenizationPageComponent } from './tokenization-page/tokenization-page.component';
import { TokenRoutingModule } from './token-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TokenRoutingModule,
    FormsModule
  ],
  declarations: [TokenizationPageComponent]
})
export class TokenizationModule { }
