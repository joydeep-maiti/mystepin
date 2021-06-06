import http from "./httpService";

async function getBillingOptions(optiontype) {
  try {
    const { data: options } = await http.get(
      `${http.baseUrl}/submenu/${optiontype}`
    );
    return options;
  } catch (error) {
    
    console.log(error);
  }
}
async function getAgentCommssion(optiontype) {
  try {
    const { data: options } = await http.get(
      `${http.baseUrl}/agentcommission/${optiontype}`
    );
    return options;
  } catch (error) {
    
    console.log(error);
  }
}
export default {getBillingOptions,getAgentCommssion};