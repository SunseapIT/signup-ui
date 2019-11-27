import { SharedModule } from './../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokenizationPageComponent } from './tokenization-page/tokenization-page.component';
import { TokenRoutingModule } from './token-routing.module';

@NgModule({
  imports: [
    CommonModule,
    TokenRoutingModule,
    FormsModule,
    SharedModule
  ],
  declarations: [TokenizationPageComponent]
})
export class TokenizationModule { }
