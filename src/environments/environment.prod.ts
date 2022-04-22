import { environment } from './base';

environment.production = true;
environment.subDomain = true;
//environment.apiUrl = 'http://111.93.31.229:8085/api/v1/'
// environment.apiUrl = "https://signup-uat.sunseap.com/api/";
environment.apiUrl = "https://signup.sunseap.com";
// environment.apiUrl = 'https://b2c.sunseap.com';

// environment.reCaptchaSiteKey = '6Lf4RnMUAAAAAK0jR77zYksK25vxOBt_NbV6M_fz';

environment.reCaptchaSiteKey  = '6LcGSdgaAAAAAJTLevd-J8E-OVAhPa0cvr2c9rWv'; //PROD

export { environment };
