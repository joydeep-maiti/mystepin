import http from "./httpService";

async function getBookings(monthObj) {
  try {
    const { data: bookings } = await http.post(
      `${http.baseUrl}/bookings/filterByMonth`,
      monthObj
    );
    return bookings;
  } catch (error) {
    
    console.log(error);
  }
}
async function addBooking(booking) {
  try {
    return await http.post(`${http.baseUrl}/bookings/insert`, booking);
  } catch (error) {
    console.log(error);
  }
}//${http.baseUrl} //http://localhost:5000
async function getProofId(id) {
  try {
    return await http.get(`${http.baseUrl}/booking/idproof/${id}`);
  } catch (error) {
    console.log(error);
  }
}

async function updateBooking(booking) {
  try {
    return await http.put(`${http.baseUrl}/bookings/update`, booking);
  } catch (error) {
    console.log(error);
  }
}

async function getDayCheckin(date) {
  try {
    const { data: bills } =  await http.get(`${http.baseUrl}/bookings/dayCheckin?date=${date}`);
    return bills;
  } catch (error) {
    console.log(error);
  }
}

export default { getBookings, addBooking, updateBooking, getProofId, getDayCheckin };
