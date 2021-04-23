import http from "./httpService";

async function getDailyOccupancyReport(optiontype) {
  try {
    const { data } = await http.get(
      `${http.baseUrl}/dailyreport`
    );
    return data;
  } catch (error) {
    
    console.log(error);
  }
}


async function getMonthlyOccupancyReport(category,startDate,endDate) {
  try {
    const {data} = await http.get(`${http.baseUrl}/monthlyreport?reportType=${category}&fromDate=${startDate}&toDate=${endDate}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export default { getDailyOccupancyReport ,getMonthlyOccupancyReport};