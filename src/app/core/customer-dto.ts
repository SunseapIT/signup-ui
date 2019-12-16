import { Files } from "./file-dto";

export class CustomerDto {
   
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

   lavel:string;

   unitNo: string;
    
   streetName:string;
   
   sighnUpStarTimeStamp:string;

   sighnUpEndTimeStamp:string;
}
