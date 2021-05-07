import http from "./httpService";

async function getGuestDetails(startD,currentD,guestCategory) {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/guestReport?fromDate=${startD}&toDate=${currentD}&reportType=${guestCategory}`);
    return details;
  } catch (error) {
    console.log(error);
  }
}


export default {getGuestDetails}