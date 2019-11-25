import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TokenizationPageComponent } from './tokenization-page/tokenization-page.component';



const routes: Routes = [
   
     {path: 'pay', component: TokenizationPageComponent },
   
    ];
     

 


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)   
  ],
  exports: [RouterModule]
})
export class TokenRoutingModule { }