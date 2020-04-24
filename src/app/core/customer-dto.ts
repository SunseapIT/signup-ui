import { PlanBean } from '@app/core/plan-bean';
import { Files } from "./file-dto";
import { tokenDto } from './token-dto';

export class CustomerDto {

   customerId: any;

   approved: boolean;

   approvedTime: any;

   files = new Files();

   token: string;

   plan: string;

   fullName: string;

   lastName: string;

   eamilAddress: string;

   mobileNumber: string;

   spAccountNumber: string;

   promoCode: Array<string>;

   postelCode: string;

   buildingName: string;

   dwelingType: string;

   houseNo: string;

   accountNumber:string;

   level: string;

   unitNo: string;

   streetName: string;

   country: string;

   sighnUpStarTimeStamp: string;

   sighnUpEndTimeStamp: string;

   selfSignup: boolean;

   contentToMarketing: boolean;

   captchaResponse : string;
   
   planDetails: PlanBean;

   userId : string;

   password: string;

   confirmPassword:string;

   tokenDtoList:tokenDto;

   rate:string;

   isSelfSignupDes:string;

   isContentToMarketingDes:string;

   etc:string;

}
