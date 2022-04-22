import { Component } from '@angular/core';

@Component({
  selector: 'app-new-page-not-found',
  templateUrl: 'new-page-not-found.component.html',
  styles: [`
    .error-code {
      font-size: 300px;
    }
    .oops {
      font-size: 120px;
    }
    .explanation {
      font-size: 2.5rem;
      font-family : Yantramanav;
    }
    .home-btn {
        display: block;
    width: 184px;
    box-sizing: border-box;
    background-color: #d2232a;
    color: #ffffff !important;
    border-radius: 10px;
    text-align: center;
    padding: 0;
    height: 46px;
    font-family : Yantramanav;
    }
   
    @media only screen and (min-width: 1200px) {
      .wid {
        max-width: 1140px !important;
      }
    }
  
    
  `],
})

export class NewPageNotFoundComponent { }
