import http from "./httpService";

async function getBookings(startdate,enddate) {
  try {
    const { data: bookings } = await http.get(
      `${http.baseUrl}/bookingsbydate?fromDate=${startdate}&toDate=${enddate}`
    );
    return bookings;
  } catch (error) {
    
    console.log(error);
  }
}
export default {getBookings};