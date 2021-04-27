import http from "./httpService";

async function getRate() {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/rateMaster`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function getRatepercent() {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/rateMaster/percentage`);
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function getDayWiseRate(from, to) {
  try {
    const { data: rooms } = await http.get(`${http.baseUrl}/rate`,{
      params: {
        fromDate:from,
        toDate:to
      }
    });
    return rooms;
  } catch (error) {
    console.log(error);
  }
}

async function addRate(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/rateMaster`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateRate(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/rateMaster`,
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

async function updateRateByPercent(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/rateMaster/percentage`,
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

async function deleteRate(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/rateMaster/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

export default { getRate, addRate, updateRate, deleteRate , getDayWiseRate, updateRateByPercent, getRatepercent };
