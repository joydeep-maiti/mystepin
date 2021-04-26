import http from "./httpService";
async function getAdvanceByBookingId(id) {
  try {
    const { data: rooms } = await http.get(`http://localhost:5000/advance/${id}`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function addAdvance(data) {
  try {
    const response = await http.post(
      `http://localhost:5000/advance`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateAdvance(data) {
  try {
    const response = await http.patch(
      `http://localhost:5000/advance`,
      data
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

export default { getAdvanceByBookingId, addAdvance, updateAdvance};
