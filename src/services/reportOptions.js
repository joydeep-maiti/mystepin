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
// async function getBillingOptions1(optiontype) {
//   try {
//     const { data: options } = await http.get(
//       `http://localhost:5000/agentmenu/${optiontype}`
//     );
//     return options;
//   } catch (error) {
    
//     console.log(error);
//   }
// }
export default {getBillingOptions};