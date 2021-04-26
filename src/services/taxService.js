import http from "./httpService";

async function getTaxSlabs() {
  try {
    const { data: taxSlabs } = await http.get(`${http.baseUrl}/taxSlabs`);
    return taxSlabs;
  } catch (error) {
    console.log(error);
  }
}

async function updatetaxDetails(data) {
  try {
    const response = await http.patch(
      `${http.baseUrl}/taxSlabs`,
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

export default { getTaxSlabs , updatetaxDetails};
