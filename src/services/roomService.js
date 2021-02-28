import http from "./httpService";

async function getRooms() {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/rooms`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function getAvailableRooms(checkIn, checkOut, bookingId = null) {
  try {
    const { data: availableRooms } = await http.post(
      `${http.baseUrl}/rooms/available`,
      {
        checkIn,
        checkOut,
        bookingId
      }
    );
    return availableRooms;
  } catch (error) {
    console.log(error);
  }
}


async function addRoom(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/rooms`,
      data
    );
    if(response.status === 201)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateRoom(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/rooms`,
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

async function deleteRoom(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/rooms/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

export default { getRooms, getAvailableRooms, addRoom, updateRoom, deleteRoom};
