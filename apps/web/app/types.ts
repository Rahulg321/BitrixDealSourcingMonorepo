export type Deal = {
  TITLE: string; // Title of the deal
  COMPANY_ID: number; // Company ID associated with the deal
  CONTACT_ID: number; // Contact ID associated with the deal
  UF_CRM_1715146259470?: number; // EBITDA or Revenue (optional)
  UF_CRM_1715146372084?: string; // CIM Link (optional)
  UF_CRM_1711452630282?: Array<{ file: string }>; // Teaser Document (optional)
  UF_CRM_1711453168658?: string; // Location custom field (optional)
  OPPORTUNITY?: number; // Revenue or deal value
  CURRENCY_ID?: string; // Currency for the deal (e.g., "USD")
};

export type ScrapedDeal = {
  TITLE: string; // Title of the deal
  COMPANY_ID: number; // Company ID associated with the deal
  CONTACT_ID: number; // Contact ID associated with the deal
  UF_CRM_1715146259470?: number; // EBITDA or Revenue (optional)
  UF_CRM_1715146372084?: string; // CIM Link (optional)
  UF_CRM_1711452630282?: Array<{ file: string }>; // Teaser Document (optional)
  UF_CRM_1711453168658?: string; // Location custom field (optional)
  OPPORTUNITY?: number; // Revenue or deal value
  CURRENCY_ID?: string; // Currency for the deal (e.g., "USD")
};

export enum UserRole {
  USER,
  ADMIN,
}
