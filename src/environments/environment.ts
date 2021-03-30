import { environment } from './base';

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   apiUrl: '',
//   apiVersion: 'v1_0',
// };

environment.apiUrl = 'https://signup.sunseap.com'; // stage
environment.dialogUrl = 'https://b2c.sunseap.com'; // prod


//  environment.reCaptchaSiteKey = '6LcIXL4ZAAAAABH_HufA-P7kLfLcR2vYuyttliWK'; //UATlatest

// environment.reCaptchaSiteKey ='6Le8F-QUAAAAANLvdpKtY5jb_RrH2vToFAp4y_M1'

 environment.reCaptchaSiteKey = '6Lc-b-QUAAAAAMBSldHxWKjA3vKbgp9f3x8N0aiU';//PROD
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
