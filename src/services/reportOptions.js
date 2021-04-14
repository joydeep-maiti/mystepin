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
export default {getBillingOptions};