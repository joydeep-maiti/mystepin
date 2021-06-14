
import http from "./httpService";

async function getKOTByBookingId(id) {
  try {
    const { data: items } = await http.get(`${http.baseUrl}/kot/${id}`);
    return items;
  } catch (error) {
    console.log(error);
  }
}
async function addKOT(kot) {

console.log("Add Data",kot)
  try {
    const {data,status} = await http.post(
      `${http.baseUrl}/kot`,
      kot
    );
    return {data,status}
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

const getKOTArray = async (bookingId,kotID )=>{

  try{
    const {data:kotarray} = await http.get(`${http.baseUrl}/kotById/${bookingId}/${kotID}`)
    return kotarray
  }catch (error) {
    console.log(error);
  }

}

export default { getKOTByBookingId, addKOT, updateKOT,getKOTArray};
