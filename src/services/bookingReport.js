import http from "./httpService";


async function getBookingReport(category,startDate,endDate) {
  try {
    const { data: booking } = await http.get(`${http.baseUrl}/bookingreport?fromDate=${startDate}&toDate=${endDate}&reportType=${category}`
    );
    return booking;
  } catch (error) {
    console.log(error);
  }
}


export default {getBookingReport};