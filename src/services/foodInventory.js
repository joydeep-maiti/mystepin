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

export default { getFoodItems, addFoodItem, updateFoodItem, deleteFoodItem };
