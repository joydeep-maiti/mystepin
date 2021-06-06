import http from "./httpService";

async function getAgentDetails(startD,currentD,agentCategory) {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/agentreport?fromDate=${startD}&toDate=${currentD}&reportType=${agentCategory}`);
   // const { data: details } = await http.get(`http://localhost:5000/agentreport?fromDate=${startD}&toDate=${currentD}&reportType=${agentCategory}`);

    return details;
  } catch (error) {
    console.log(error);
  }
}
async function getAgentCommissionDetails(startD,currentD,agentCategory,agentcommission) {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/agentreport?fromDate=${startD}&toDate=${currentD}&reportType=${agentCategory}&agent=${agentcommission}`);
    return details;
  } catch (error) {
    console.log(error);
  }
}


export default {getAgentDetails,getAgentCommissionDetails}

//http://localhost:5000/agentreport?reportType=Agent Collection&fromDate=2021-05-10&toDate=2021-05-28
//http://localhost:5000/agentreport?reportType=Agent Commission&fromDate=2021-04-10&toDate=2021-05-28&agent=Gobibo