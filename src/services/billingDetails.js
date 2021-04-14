import http from "./httpService";

async function getBookings(startDate,endDate) {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/bookingsbydate/$fromDate:${startDate}&toDate:${endDate}`);
    return details;
  } catch (error) {
    console.log(error);
  }
}


export default {getBookings}