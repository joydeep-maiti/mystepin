let gatewayApi;

console.log(process.env.NODE_ENV);

// gatewayApi = "https://stepin-api.herokuapp.com";
// gatewayApi = process.env.API_URL;
 gatewayApi = "http://localhost:5000";
// gatewayApi = process.env.API_URL;

// gatewayApi = "http://localhost:5000";


// if (process.env.NODE_ENV === "development")
//   gatewayApi = "http://localhost:5000";
// else if (process.env.NODE_ENV === "production")
//   gatewayApi = "https://stepin-api.herokuapp.com";

export const API_ROOT = gatewayApi;
