import http from "./httpService";

async function getAgentDetails(startD,currentD,agentCategory) {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/agentreport?fromDate=${startD}&toDate=${currentD}&reportType=${agentCategory}`);
    return details;
  } catch (error) {
    console.log(error);
  }
}


export default {getAgentDetails}

//http://localhost:5000/agentreport?reportType=Agent Collection&fromDate=2021-05-10&toDate=2021-05-28