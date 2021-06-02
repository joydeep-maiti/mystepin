import http from "./httpService";

async function getUsers() {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/user`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function addUser(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/user`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function login(data) {
  try {
    const {data:response } = await http.post(
      `${http.baseUrl}/user/login`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateUser(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/user`,
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

async function deleteUser(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/user/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

export default { getUsers, addUser, updateUser, deleteUser, login };
