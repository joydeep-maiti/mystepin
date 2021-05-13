import http from "./httpService";

async function getAllCheckOuts() {
  try {
    const { data: bills } = await http.get(`${http.baseUrl}/getAllBills`);
    return bills;
  } catch (error) {
    console.log(error);
  }
}
//`${http.baseUrl}/getAllBills`
async function getBillsByDate(date) {
  try {
    const { data: bills } = await http.get(`${http.baseUrl}/getBillsbyDate?date=${date}`);
    return bills;
  } catch (error) {
    console.log(error);
  }
}
// `http://localhost:5000/getBillsbyDate?date=${date}`
export default { getAllCheckOuts,getBillsByDate};

