export enum CustomerType {
  Residential = 1, Commercial = 2, Industrial = 3,
  Governmental = 4, NotAvailable = 5,
}

export const CUSTOMER_TYPE_OPTIONS: { [key: number]: string } = {
  [CustomerType.Residential]: 'Residential',
  [CustomerType.Commercial]: 'Commercial',
  [CustomerType.Industrial]: 'Industrial',
  [CustomerType.Governmental]: 'Governmental',
  [CustomerType.NotAvailable]: 'N/A',
};

export enum PricingPlanRateStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export const PRICING_PLAN_RATE_STATUS_OPTIONS: { [key: string]: string } = {
  [PricingPlanRateStatus.Active]: 'Active',
  [PricingPlanRateStatus.Inactive]: 'Inactive',
};

export enum IdentificationType {
  NricPink = 'nric - pink',
  NricBlue = 'nric - blue',
  EmploymentPass = 'employment pass',
  WorkPermit = 'work permit',
}

export const IDENTIFICATION_TYPE_OPTIONS: { [key: string]: string } = {
  [IdentificationType.NricPink]: 'NRIC – Pink',
  [IdentificationType.NricBlue]: 'NRIC – Blue',
  [IdentificationType.EmploymentPass]: 'Employment pass',
  [IdentificationType.WorkPermit]: 'Work permit',
};

export enum DwellingType {
  Bungalow = 'Bungalow',
  Condo = 'Condominium',
  Hdb1Room = 'HDB 1 Room',
  Hdb2Room = 'HDB 2 Room',
  Hdb3Room = 'HDB 3 Room',
  Hdb4Room = 'HDB 4 Room',
  Hdb5RoomExecApt = 'HDB 5 Room', 
  // NonResidential = 'Non-Residential',
  Terrace = 'Terrace',
  SemiDetached = 'Semi-Detached',
 
}

export const DWELLING_TYPE_OPTIONS: { [key: string]: string } = {
  [DwellingType.Hdb1Room]: 'HDB 1 Room',
  [DwellingType.Hdb2Room]: 'HDB 2 Room',
  [DwellingType.Hdb3Room]: 'HDB 3 Room',
  [DwellingType.Hdb4Room]: 'HDB 4 Room',
  [DwellingType.Hdb5RoomExecApt]: 'HDB 5 Room',
  [DwellingType.Condo]: 'Condominium',
  [DwellingType.Terrace]: 'Terrace',
  [DwellingType.SemiDetached]: 'Semi-Detached',
  [DwellingType.Bungalow]: 'Bungalow',
  // [DwellingType.NonResidential]: 'Non-Residential'
};

// early charge based on dwelling type
export const ETC_FEE_OPTIONS: { [key: string]: number } = {
  [DwellingType.Hdb1Room]: 15,
  [DwellingType.Hdb2Room]: 15,
  [DwellingType.Hdb3Room]: 20,
  [DwellingType.Hdb4Room]: 25,
  [DwellingType.Hdb5RoomExecApt]: 30,
  [DwellingType.Condo]: 40,
  [DwellingType.Terrace]: 50,
  [DwellingType.SemiDetached]: 70,
  [DwellingType.Bungalow]: 80,
};

export interface DataTableParams {
  offset?: number;
  limit?: number;
  sortBy?: string;
  sortAsc?: boolean;
  fromDate?: string;
  toDate?: string;
  criteria?: object;
}

export enum ProductType {
  Dot = 'dot',
  Fix = 'fix',
}

export enum TransactionTypes {
  Axs = 'axs',
  Dbs = 'dbs',
  Manual = 'manual',
  Ocbc = 'ocbc',
  Giro = 'giro',
  Paynow = 'paynow',
  Cheque = 'cheque'
}

export enum TransactionStatus {
  New = 'new',
  Paid = 'paid',
  Done = 'done',
  Rejected = 'rejected',
  Cancelled = 'cancelled',
  Submitted = 'submitted'
}
