const axios = require("axios");
//const dotenv = require("dotenv");
const Contact = require("../models/contactModel");

//dotenv.config();
let scrapeEnabled = false; // Flag to control scraping

async function fetchContact() {
  try {

    if (!scrapeEnabled) {
      console.log('Scraping is currently disabled.');
      return;
  }

    const response = await axios.get(
      "https://api.hamrobazaar.com/api/AppData/GetAllCategory",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "access-control-allow-origin": "*",
          apikey: "09BECB8F84BCB7A1796AB12B98C1FB9E",
          country_code: "null",
          deviceid: "41e30e21-1007-4a8f-a1ef-baa48e11eb89",
          devicesource: "web",
          "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "strict-transport-security": "max-age=2592000",
          "x-content-type-options": "nosniff",
          "x-frame-options": "SAMEORIGIN",
          Referer: "https://hamrobazaar.com/",
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
      }
    );
    const { data } = response.data;
    for (const category of data) {
      console.log(`Currently Scraping ${category.id} Category`);
      await getAll(category.id);
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
  }
}

async function getAll(CategoryId) {
  let nextPageNumber = 1;
  while (true) {
    try {
      const response = await axios.get(
        `https://api.hamrobazaar.com/api/Product?PageSize=1000&CategoryId=${CategoryId}&IsHBSelect=false&PageNumber=${nextPageNumber}`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "access-control-allow-origin": "*",
            apikey: "09BECB8F84BCB7A1796AB12B98C1FB9E",
            country_code: "null",
            deviceid: "41e30e21-1007-4a8f-a1ef-baa48e11eb89",
            devicesource: "web",
            "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "strict-transport-security": "max-age=2592000",
            "x-content-type-options": "nosniff",
            "x-frame-options": "SAMEORIGIN",
            Referer: "https://hamrobazaar.com/",
            "Referrer-Policy": "strict-origin-when-cross-origin",
          },
        }
      );
      const { data } = response.data;
      let nextPage = response.data.nextPageNumber;
      let totalRecords = response.data.totalRecords;
      if (nextPage == null) {
        break;
      }
      console.log(`Currently Scraping Page ${nextPage}`);
      if (nextPage === 2) {
        console.log(`Total Records: ${totalRecords}`);
      }
      const value = [];
      const uniqueSet = new Set();
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].creatorInfo == null ||
          data[i].creatorInfo == undefined
        ) {
          continue;
        }
        if (
          data[i].creatorInfo.createdByUsername == null ||
          data[i].creatorInfo.createdByUsername == undefined
        ) {
          continue;
        }
        // Omitted phone numbers with obscured portions, such as "986***9399", to maintain data integrity.
        if (!data[i].creatorInfo.createdByUsername.includes("*")) {
          const contactObject = {
            name: data[i].creatorInfo.createdByName,
            contact: data[i].creatorInfo.createdByUsername,
          };
          const contactString = JSON.stringify(contactObject);
          if (!uniqueSet.has(contactString)) {
            value.push(contactObject);
            uniqueSet.add(contactString);
          }
        }
      }
      try {
        await Contact.insertMany(value);
        console.log(
          `Successfully inserted Contact Information for ${
            nextPage - 1
          }`
        );
        value.length = 0;
        uniqueSet.clear();
      } catch (error) {
        console.log("Something went wrong");
      }
      nextPageNumber = nextPage;
    } catch (error) {
      console.error("Error fetching data:", error.message);
      break;
    }
  }
}

module.exports = { fetchContact, getAll };
