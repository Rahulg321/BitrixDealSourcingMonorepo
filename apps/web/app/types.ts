export type DEAL = {
  location: string;
  pursued_on: Date;
  deal_title: string;
  EBITDA: number;
  Revenue: number;
  teaser: string;
  industry:
    | "Manufacturing"
    | "Healthcare"
    | "Technology & Software"
    | "Industrial Services"
    | "Accountant"
    | "Business Services";
};
