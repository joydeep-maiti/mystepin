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
}

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

export default { getBookings, addBooking, updateBooking, getProofId };
