import http from "./httpService";

async function getSeason() {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/season`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function addSeason(data,flag) {
  try {
    const response = await http.post(
      `${http.baseUrl}/season?copyrate=${flag}`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateSeason(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/season`,
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

async function deleteSeason(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/season/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

export default { getSeason, addSeason, updateSeason, deleteSeason };
