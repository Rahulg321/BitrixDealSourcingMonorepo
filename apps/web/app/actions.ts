"use server";

import axios from "axios";

export async function findCompany(companyName: string) {
  try {
    const response = await axios.post(
      `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.company.list.json`,
      {
        filter: { TITLE: companyName }, // Searching by company title
        select: ["ID", "TITLE"], // Only return the ID and Title of the company
      }
    );

    if (response.data.result.length > 0) {
      console.log("company already exists");
      return response.data.result[0]; // Return the first matched company
    } else {
      console.log("company does not exist");
      return null; // No company found
    }
  } catch (error: any) {
    console.error(
      "Error searching for company:",
      error.response ? error.response.data : error.message
    );
  }
}

export async function createCompanyIfNotExists(companyName: string) {
  // Step 1: Check if the company exists
  const existingCompany = await findCompany(companyName);

  if (existingCompany) {
    console.log("Company already exists:", existingCompany);
    return {
      success: true,
      result: existingCompany.ID,
      message: "Company already exists",
    }; // Return the existing company ID
  } else {
    // Step 2: Create the company if it doesn't exist
    const companyData = {
      fields: {
        TITLE: companyName,
        INDUSTRY: "IT", // Example industry
        UF_CRM_1711453168658: "New York", // Location custom field
      },
    };

    try {
      const response = await axios.post(
        `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.company.add.json`,
        companyData
      );
      console.log("New company created with ID:", response.data.result);
      return {
        success: true,
        result: response.data.result,
        message: "CREATED A NEW COMPANY IN THE CRM",
      }; // Return the new company ID
    } catch (error: any) {
      console.error(
        "Error creating company:",
        error.response ? error.response.data : error.message
      );
      return {
        error: true,
        message: "Error CREATING COMPANY",
      };
    }
  }
}

export const addDeal = async () => {
  try {
    const data = {
      TITLE: "Deal Title",
      STAGE_ID: "NEW",
      COMPANY_ID: 1,
      CONTACT_ID: 2,
      OPPORTUNITY: 1000,
      CURRENCY_ID: "USD",
      OPENED: "Y",
      ASSIGNED_BY_ID: 1,
      COMMENTS: "Initial deal setup.",
    };

    const response = await axios.post(
      `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.deal.add.json`,
      data
    );

    console.log("ADDED DEAL TO THE CRM");
    return {
      success: "ADDED DEAL TO THE CRM",
    };
  } catch (error: any) {
    console.error(
      "an error occured while submitting to CRM",
      error.status,
      error,
      error.message
    );
  }

  return {
    error: "COULD NOT SEND DEAL TO THE CRM",
  };
};
