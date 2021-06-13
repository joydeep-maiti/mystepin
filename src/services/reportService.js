import http from "./httpService";

async function getDailyOccupancyReport() {
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

async function getUserLogReport(user,fromDate, toDate) {
  try {
    const {data} = await http.get(`${http.baseUrl}/report/userlog`,{params:{user,fromDate, toDate}});
    return data;
  } catch (error) {
    console.log(error);
  }
}

export default { getDailyOccupancyReport ,getMonthlyOccupancyReport, getUserLogReport};