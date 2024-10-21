"use server";

import axios from "axios";
import { SnapshotDeal } from "../../lib/db";
// import PDFDocument from "pdfkit"; // Library to generate PDF

// async function createTeaserDocFromContent(
//   main_content: string,
//   teaserDocPath: string
// ): Promise<void> {
//   return new Promise((resolve, reject) => {
//     const doc = new PDFDocument();
//     const stream = fs.createWriteStream(teaserDocPath);

//     // Start writing to the stream
//     doc.pipe(stream);

//     // Add main content to the PDF
//     doc.text(main_content);

//     // Finalize the PDF file
//     doc.end();

//     // Resolve once the file is finished
//     stream.on("finish", resolve);
//     stream.on("error", reject);
//   });
// }

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
}: SnapshotDeal) => {
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

    const cleanedRevenue = revenue
      ? parseFloat(revenue.replace(/[^0-9.]/g, ""))
      : 0;

    if (isNaN(cleanedRevenue)) {
      throw new Error(
        "Invalid revenue: Please ensure the revenue value is numeric."
      );
    }

    // Step 4: Clean and convert the asking price if it exists
    let cleanedAskingPrice = null;
    if (asking_price) {
      cleanedAskingPrice = parseFloat(asking_price.replace(/[^0-9.]/g, ""));
      if (isNaN(cleanedAskingPrice)) {
        throw new Error(
          "Invalid asking price: Please ensure the value is numeric."
        );
      }
    }
    // Step 3: Prepare deal data based on the deal card props
    const data = {
      fields: {
        TITLE: title, // Title of the deal, from the prop
        COMPANY_ID: company.result, // Company ID from Bitrix CRM
        CONTACT_ID: contact.result, // Contact ID from Bitrix CRM
        OPPORTUNITY: cleanedAskingPrice,
        UF_CRM_1715146259470: cleanedRevenue, // EBITDA (Revenue), now a valid number
        UF_CRM_1715146372084: link, // CIM Link (mapped to the provided link field)
        UF_CRM_1711452630282: [{ file: main_content }], // Teaser Doc (static for now, but can be dynamic)
        UF_CRM_1711453168658: state, // Location, mapped to the state prop
        CURRENCY_ID: "USD", // Currency, assuming USD as a default
        COMMENTS: main_content, // Additional deal content, saved in the comments field
        CATEGORY_ID: category, // Category field (mapped to category prop if Bitrix supports it)
        UF_CRM_UNDER_CONTRACT: under_contract ? "Yes" : "No", // A custom field for under contract status
        UF_CRM_LISTING_CODE: listing_code, // A custom field for the listing code
        UF_CRM_TEASER: main_content, // Custom field for teaser content
      },
    };

    console.log("data being published is", data);

    // Step 4: Send the deal data to the CRM
    const response = await axios.post(
      `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.deal.add.json`,
      data
    );

    console.log("Response", response);

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
    console.error("An error occurred while submitting the deal to CRM:", error);
    return {
      type: "error",
      message: "An error occurred while submitting the deal to CRM",
    };
  }
};
