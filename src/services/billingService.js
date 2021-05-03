import http from "./httpService";

async function getBillByBookingId(id) {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/billing/${id}`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}
async function addBilling(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/billing`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

// async function updatePos(data) {
//   try {
//     const response = await http.patch(
//       `${http.baseUrl}/pos`,
//       data
//     );
//     if(response.status === 200)
//       return true
//     return false
//   } catch (error) {
//     console.log(error);
//     return false
//   }
// }

async function getRecentCheckouts() {
  try {
    const { data: bills } = await http.get(`${http.baseUrl}/checkouts`);
    return bills;
  } catch (error) {
    console.log(error);
  }
}

export default { getBillByBookingId,addBilling, getRecentCheckouts };

