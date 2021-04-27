import http from "./httpService";


async function getBookingReport(category,startDate,endDate) {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/bookingreport?fromDate=${startDate}&toDate=${endDate}&reportType=${category}`
    );
    return rooms;
  } catch (error) {
    console.log(error);
  }
}


export default {getBookingReport};