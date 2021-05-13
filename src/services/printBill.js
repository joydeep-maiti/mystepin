import http from "./httpService";

async function getAllCheckOuts() {
  try {
    const { data: bills } = await http.get(`http://localhost:5000/getAllBills`);
    return bills;
  } catch (error) {
    console.log(error);
  }
}
//`${http.baseUrl}/getAllBills`
async function getBillsByDate(date) {
  try {
    const { data: bills } = await http.get(`http://localhost:5000/getBillsbyDate?date=${date}`);
    return bills;
  } catch (error) {
    console.log(error);
  }
}
// `${http.baseUrl}/billing?date=${date}`
export default { getAllCheckOuts,getBillsByDate};

