import http from "./httpService";

async function getTaxCollectionReport(startD,currentD,collectionCategory) {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/taxCollection?fromDate=${startD}&toDate=${currentD}&reportType=${collectionCategory}`);
    console.log(details)
    return details;
  } catch (error) {
    console.log(error);
  }
}


export default {getTaxCollectionReport}