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
export default { getDailyOccupancyReport };