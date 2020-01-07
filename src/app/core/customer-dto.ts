import { Files } from "./file-dto";

export class CustomerDto {
   
   customerId:any;

   approved:boolean;

   approvedTime: any;

   files =  new Files(); 

   token:string;

   plan:string;
    
   fullName:string;
   
   lastName:string;

   eamilAddress:string;
    
   mobileNumber:string;
    
   spAccountNumber:string;
    
   promoCode : Array<string>; 
   
   postelCode:string;    
    
   buildingName:string;
    
   dwelingType:string;
    
   houseNo:string;

   level:string;

   unitNo: string;
    
   streetName:string;
   
   country : string;

   sighnUpStarTimeStamp:string;

   sighnUpEndTimeStamp:string;
   
}
