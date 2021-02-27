import http from "./httpService";

async function getRoomsTypes() {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/roomcategory`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function addRoomType(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/roomcategory`,
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

async function updateRoomType(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/roomcategory`,
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

async function deleteRoomType(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/roomcategory/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

export default { getRoomsTypes, addRoomType, updateRoomType, deleteRoomType };
