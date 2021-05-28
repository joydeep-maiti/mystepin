import http from "./httpService";

async function getFoodItems() {
  try {
    const { data: items } = await http.get(`${http.baseUrl}/foodInventory`);
    console.log("item response",items)
    return items;
  } catch (error) {
    console.log(error);
  }
}

async function addFoodItem(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/foodInventory`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateFoodItem(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/foodInventory/`,
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

async function deleteFoodItem(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/foodInventory/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}

// ***************************************** Laundry **************************
async function getLaundaryItems() {
  try {
    const { data: items } = await http.get(`${http.baseUrl}/laundaryInventory`);
    console.log("item response",items)
    return items;
  } catch (error) {
    console.log(error);
  }
}

async function addLaundaryItem(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/laundaryInventory`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateLaundaryItem(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/laundaryInventory/`,
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

async function deleteLaundaryItem(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/laundaryInventory/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}
// ********************************************* House Keeping ***************************************************************
async function getHouseKeepingItems() {
  try {
    const { data: items } = await http.get(`${http.baseUrl}/laundaryInventory`);
    console.log("item response",items)
    return items;
  } catch (error) {
    console.log(error);
  }
}

async function addHouseKeepingItem(data) {
  try {
    const response = await http.post(
      `${http.baseUrl}/laundaryInventory`,
      data
    );
    return response
  } catch (error) {
    console.log(error);
    return false
  }
}

async function updateHouseKeepingItem(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/laundaryInventory/`,
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

async function deleteHouseKeepingItem(data) {
  try {
    const response = await http.delete(
      `${http.baseUrl}/laundaryInventory/${data._id}`
    );
    if(response.status === 200)
      return true
    return false
  } catch (error) {
    console.log(error);
    return false
  }
}
export default { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem,
                getLaundaryItems,addLaundaryItem,updateLaundaryItem,deleteLaundaryItem,
                getHouseKeepingItems,addHouseKeepingItem,updateHouseKeepingItem,deleteHouseKeepingItem};
