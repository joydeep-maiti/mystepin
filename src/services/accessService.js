import http from "./httpService";

async function getAcess(params) {
  try {
    const response = await http.get(`${http.baseUrl}/access`,{params});
    return response;
  } catch (error) {
    console.log(error);
  }
}


async function updateAccess(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/access`,
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


export default { getAcess, updateAccess };
