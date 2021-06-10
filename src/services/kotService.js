
import http from "./httpService";

async function getKOTByBookingId(id) {
  try {
    const { data: items } = await http.get(`${http.baseUrl}/kot/${id}`);
    return items;
  } catch (error) {
    console.log(error);
  }
}
async function addKOT(data) {

console.log("Add Data",data)
  try {
    const response = await http.post(
      `${http.baseUrl}/kot`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}
async function updateKOT(kot) {

  console.log('Update KOT',kot)

  try {
    const {data,status} = await http.patch(
      `${http.baseUrl}/kot`,
      kot
    );
    return {data,status};
  } catch (error) {
    console.log(error);
    return false
  }
}

export default { getKOTByBookingId, addKOT, updateKOT};
