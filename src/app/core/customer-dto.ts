import { Files } from "./file-dto";

export class CustomerDto {
   
   customerId:any;

   approved:boolean;

   approvedTime: any;

   files =  new Files(); 

   token:string;

   plan:string;
    
   postelCode:string;
    
   fullName:string;
   
   lastName:string;

   eamilAddress:string;
    
   mobileNumber:string;
    
   spAccountNumber:string;
    
   promoCode : Array<string>; 
    
   buildingName:string;
    
   dwelingType:string;
    
   houseNo:string;

   level:string;

   unitNo: string;
    
   streetName:string;
   
   sighnUpStarTimeStamp:string;

   sighnUpEndTimeStamp:string;
}
