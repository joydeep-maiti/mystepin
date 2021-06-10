import http from "./httpService";

async function getGuestDetails(startD,currentD,guestCategory,roomNumber) {
  try {
  const { data: details } = await http.get(`${http.baseUrl}/guestReport?fromDate=${startD}&toDate=${currentD}&reportType=${guestCategory}&roomnumber=${roomNumber}`);
    //const { data: details } = await http.get(`http://localhost:5000/guestReport?fromDate=${startD}&toDate=${currentD}&reportType=${guestCategory}&roomnumber=${roomNumber}`);
    return details;
  } catch (error) {
    console.log(error);
  }
}


export default {getGuestDetails}