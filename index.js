import axios from "axios";
export const handler = async (event, context) => {
  const bearerToken = "4c3c29cd-017b-463e-9bf9-50da0e7e0030";
  let response;
  try {
    const tokenUrl = "https://api.ariba.com/v2/oauth/token";
    const queryParams = {
      grant_type: "openapi_2lo",
    };
    const headers = {
      apiKey: "stjCiIZILvIZwTWJUTWxzE5ykPCe8s3p",
      Authorization: "Basic " + process.env.BASE64_ENCODED_CLIENT_SERVER,
    };

    const res = await axios.get(tokenUrl, {
      params: queryParams,
      headers: headers,
    });

    console.log(JSON.stringify(res));

    response = {
      statusCode: 200,
      body: res,
    };
  } catch (error) {
    console.log(error);

    response = {
      statusCode: 500,
      body: "error",
    };

    throw error;
  }

  try {
    const tokenUrl =
      "https://openapi.ariba.com/api/approval/v2/prod/pendingApprovables";
    const queryParams = {
      realm: "WillScotMobileMini-1-T",
    };
    const headers = {
      apiKey: "stjCiIZILvIZwTWJUTWxzE5ykPCe8s3p",
      Authorization: "Bearer " + process.env.BEARER_TOKEN,
    };

    const res = await axios.get(tokenUrl, {
      params: queryParams,
      headers: headers,
    });

    console.log(JSON.stringify(res));

    response = {
      statusCode: 200,
      body: res,
    };
  } catch (error) {
    console.log(error);

    response = {
      statusCode: 500,
      body: "error",
    };

    throw error;
  }

  console.log("response", response);
  return response;
};
