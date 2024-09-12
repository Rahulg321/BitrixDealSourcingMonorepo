"use server";

import axios from "axios";
import { DealCardProps } from "../components/DealCard";

export async function findContact(contactName: string, contactEmail: string) {
  try {
    const response = await axios.post(
      `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.contact.list.json`,
      {
        filter: {
          NAME: contactName,
          EMAIL: contactEmail,
        },
        select: ["ID", "NAME", "EMAIL"],
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
export const addDealToCRM = async ({
  id,
  title,
  under_contract,
  revenue,
  link,
  asking_price,
  listing_code,
  state,
  category,
  main_content,
}: DealCardProps) => {
  try {
    // Step 1: Create or find the company if necessary
    const companyName = "Default Company"; // If no company info in the props, use a default or dynamic company
    const company = await createCompanyIfNotExists(companyName);

    // Step 2: Check if the contact exists and create it if necessary
    const contactName = "Default Contact"; // Similarly, set contact name
    const contactEmail = "default@example.com"; // Default or dynamic email
    const contactPhone = "1234567890"; // Default or dynamic phone
    const contact = await createContactIfNotExists(
      contactName,
      contactEmail,
      contactPhone
    );

    // Step 3: Prepare deal data based on the deal card props
    const data = {
      fields: {
        TITLE: title, // Title of the deal, from the prop
        COMPANY_ID: company.result, // Company ID from Bitrix CRM
        CONTACT_ID: contact.result, // Contact ID from Bitrix CRM
        UF_CRM_1715146259470: revenue, // EBITDA (Revenue), mapped to the custom field for revenue
        UF_CRM_1715146372084: link, // CIM Link (mapped to the provided link field)
        UF_CRM_1711452630282: [{ file: "Teaser Document" }], // Teaser Doc (static for now, but can be dynamic)
        UF_CRM_1711453168658: state, // Location, mapped to the state prop
        OPPORTUNITY: asking_price, // Asking price as opportunity (mapped to the asking_price prop)
        CURRENCY_ID: "USD", // Currency, assuming USD as a default
        COMMENTS: main_content, // Additional deal content, saved in the comments field
        CATEGORY_ID: category, // Category field (mapped to category prop if Bitrix supports it)
        UF_CRM_UNDER_CONTRACT: under_contract ? "Yes" : "No", // A custom field for under contract status
        UF_CRM_LISTING_CODE: listing_code, // A custom field for the listing code
        UF_CRM_TEASER: main_content,
      },
    };

    // Step 4: Send the deal data to the CRM
    const response = await axios.post(
      `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.deal.add.json`,
      data
    );

    console.log("ADDED DEAL TO THE CRM");
    // return {
    //   success: "ADDED DEAL TO THE CRM",
    //   dealId: response.data.result, // Return the ID of the newly created deal
    // };
    return {
      type: "success",
      message: "ADDED DEAL TO THE CRM",
    };
  } catch (error: any) {
    console.error(
      "An error occurred while submitting the deal to CRM:",
      error.message
    );
    return {
      error: "COULD NOT SEND DEAL TO THE CRM",
    };
  }
};
