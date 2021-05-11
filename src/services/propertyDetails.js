import http from "./httpService";

async function getPropertyDetails() {
  try {
    const { data: details } = await http.get(`${http.baseUrl}/propertyDetails`);
    return details;
  } catch (error) {
    console.log(error);
  }
}

async function updatePropertyDetails(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/propertyDetails`,
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


export default {getPropertyDetails,updatePropertyDetails}