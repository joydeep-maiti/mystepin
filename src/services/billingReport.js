import http from "./httpService";

async function getBillingDetails(startD,currentD,billingCategory) {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/billingReport?fromDate=${startD}&toDate=${currentD}&reportType=${billingCategory}`);
    return details;
  } catch (error) {
    console.log(error);
  }
}


export default {getBillingDetails}