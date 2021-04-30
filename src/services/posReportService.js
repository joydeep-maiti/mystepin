import http from "./httpService";


async function getPosReport(category,startDate,endDate) {
  try {
    const { data: pos } = await http.get(`${http.baseUrl}/posreport?reportType=${category}&fromDate=${startDate}&toDate=${endDate}`
    );
    return pos;
  } catch (error) {
    console.log(error);
  }
}


export default {getPosReport};