"use server";

import axios from "axios";

export async function findContact(contactName: string, contactEmail: string) {
  try {
    const response = await axios.post(
      `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.contact.list.json`,
      {
        filter: {
          NAME: contactName,
          EMAIL: contactEmail,
        }, // Searching by contact name and email
        select: ["ID", "NAME", "EMAIL"], // Only return ID, Name, and Email of the contact
      }
    );

    if (response.data.result.length > 0) {
      console.log("Contact already exists");
      return response.data.result[0]; // Return the first matched contact
    } else {
      console.log("Contact does not exist");
      return null; // No contact found
    }
  } catch (error: any) {
    console.error(
      "Error searching for contact:",
      error.response ? error.response.data : error.message
    );
  }
}

export async function createContactIfNotExists(
  contactName: string,
  contactEmail: string,
  contactPhone: string
) {
  // Step 1: Check if the contact exists
  const existingContact = await findContact(contactName, contactEmail);

  if (existingContact) {
    console.log("Contact already exists:", existingContact);
    return {
      success: true,
      result: existingContact.ID,
      message: "Contact already exists",
    }; // Return the existing contact ID
  } else {
    // Step 2: Create the contact if it doesn't exist
    const contactData = {
      fields: {
        NAME: contactName,
        EMAIL: [{ VALUE: contactEmail, VALUE_TYPE: "WORK" }],
        PHONE: [{ VALUE: contactPhone, VALUE_TYPE: "WORK" }],
      },
    };

    try {
      const response = await axios.post(
        `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.contact.add.json`,
        contactData
      );
      console.log("New contact created with ID:", response.data.result);
      return {
        success: true,
        result: response.data.result,
        message: "CREATED A NEW CONTACT IN THE CRM",
      }; // Return the new contact ID
    } catch (error: any) {
      console.error(
        "Error creating contact:",
        error.response ? error.response.data : error.message
      );
      return {
        error: true,
        message: "Error CREATING CONTACT",
      };
    }
  }
}

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

export const addDeal = async (
  companyName: string,
  contactName: string,
  contactEmail: string,
  contactPhone: string
) => {
  try {
    const company = await createCompanyIfNotExists(companyName);

    // Step 2: Check if the contact exists and create it if necessary
    const contact = await createContactIfNotExists(
      contactName,
      contactEmail,
      contactPhone
    );

    const data = {
      fields: {
        TITLE: "New Deal Title",
        COMPANY_ID: company.result,
        CONTACT_ID: contact.result,
        UF_CRM_1715146259470: 500000, // EBITDA custom field (Revenue)
        UF_CRM_1715146372084: "https://example.com/cim", // CIM Link (Custom Field)
        UF_CRM_1711452630282: [{ file: "Teaser Document" }], // Teaser Doc (File)
        UF_CRM_1711453168658: "New York", // Location custom field
        OPPORTUNITY: 1000000, // Revenue
        CURRENCY_ID: "USD",
      },
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
