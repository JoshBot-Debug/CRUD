import type { AlertColor } from "@mui/material/Alert";

export type CompanyInfo = {
  companyId: number;
  companyName: string;
  companyState: string;
  taxType: string;
  termsAndCondition: string;
  companyStateId: number;
  companyCountryId: number;
  isCessApplicable: boolean;
  isEInvoice: boolean;
};

export type FinancialYearInfo = {
  companyFinancialYearId: number;
  financialYear: string;
};

export type RoleInfo = {
  roleId: number;
  roleName: string;
};

export type User = {
  login: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  companyCount: number;
  currentCompanyFinancialYearId: number;
  currentFinancialYear: string;
  userCompanyInfo: CompanyInfo[];
  financialYearInfo: FinancialYearInfo[];
  roleInfo: RoleInfo[];
} & {
  // Extra added from the my side, the API is inconvenient
  financialYearId: string;
  companyId: string;
};

export interface Address {
  id: number;
  companyId: number;
  companyAccountId: number;
  primaryContact: string;
  address1: string;
  address2: string;
  city: string;
  countryId: string;
  districtId: string;
  stateId: string;
  pinCode: string;
  gstVatNo: string;
  email: string;
  isBilling: boolean;
  isPrimary: boolean;
  isActive: boolean;
  mobile: string;
  rowStatus: number;
  country: string;
  state: string;
  district: string;
}

export type Toast = {
  title?: string;
  message: string;
  severity: AlertColor;
};
