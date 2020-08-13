import { environment } from './base';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   apiUrl: '',
//   apiVersion: 'v1_0',
// };

//environment.apiUrl = 'https://crm-test.sunseap.com';
// environment.baseUrl= 'http://f00c8894.ngrok.io';
// environment.apiUrl = 'https://signup.uat.sunseap.com';
environment.apiUrl = 'https://b2c.uat.sunseap.com'; // stage
environment.dialogUrl = 'https://b2c.sunseap.com'; // prod
// environment.apiUrl = 'http://10.249.39.194:8000'; // minh do
// environment.apiUrl = 'http://10.248.39.135:80'; // nhan
// environment.apiUrl = 'http://10.248.39.213:8000'; // XUONG
// environment.apiUrl = 'http://10.248.39.189:8000'; // Phuc

// Site Key: 6LeHSHMUAAAAAIGKdTE4YljD-t1DHJabr45RMQEP
// Secret Key: 6LfuVukUAAAAACKs_LemrgQaa0Al5z6I1apP4dcN

 // environment.reCaptchaSiteKey = '6LeHSHMUAAAAAIGKdTE4YljD-t1DHJabr45RMQEP'; // dev
// environment.reCaptchaSiteKey = '6LfzRnMUAAAAAEB7lugNNX3WhsPNC7TKxtPSSip0'; // stage
// environment.reCaptchaSiteKey = '6Le8F-QUAAAAANLvdpKtY5jb_RrH2vToFAp4y_M1'; // UAT
// environment.reCaptchaSiteKey = '6Lc2JeQUAAAAAGbqBARwyat6hA8rYy6zYPbJD2AM' //Prod
 //environment.reCaptchaSiteKey = '6LfuVukUAAAAACKs_LemrgQaa0Al5z6I1apP4dcN'; // CI
//  environment.reCaptchaSiteKey = '6Lc-b-QUAAAAAMBSldHxWKjA3vKbgp9f3x8N0aiU';//PROD

environment.reCaptchaSiteKey = '6LdzxaMZAAAAABXUlFedN1VU5rx8coffiz9OWLT0'; //UAT




export {
    environment
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
