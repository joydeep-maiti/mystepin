import http from "./httpService";

async function getweekview(startDate,endDate) {
    try {
      const {data} = await http.get(`${http.baseUrl}/weekview?weekviewDates=$&fromDate=${startDate}&toDate=${endDate}`);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  export default {getweekview};