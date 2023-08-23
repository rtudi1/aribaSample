import axios from "axios";
export const handler = async (event, context) => {
  const bearerToken = "4c3c29cd-017b-463e-9bf9-50da0e7e0030";
  let response;
  //   try {
  //     const tokenUrl = "https://api.ariba.com/v2/oauth/token";
  //     const queryParams = {
  //       grant_type: "openapi_2lo",
  //     };
  //     const headers = {
  //       "apiKey": "stjCiIZILvIZwTWJUTWxzE5ykPCe8s3p",
  //       "Content-Type": "application/json",
  //     };

  //     const auth = {
  //       username: "stjCiIZILvIZwTWJUTWxzE5ykPCe8s3p",
  //       password: "KGlVTA8U8AjybmdhAAKcqMoWqqV6DcF6",
  //     };

  //     const res = await axios.get(tokenUrl, {
  //       params: queryParams,
  //       headers: headers,
  //       auth: auth,
  //     });

  //     console.log(res);

  //     response = {
  //       statusCode: 200,
  //       body: res,
  //     };
  //   } catch (error) {
  //     console.log(error);

  //     response = {
  //       statusCode: 500,
  //       body: "error",
  //     };

  //     throw error;
  //   }

  try {
    const tokenUrl =
      "https://openapi.ariba.com/api/approval/v2/prod/pendingApprovables";
    const queryParams = {
      realm: "WillScotMobileMini-1-T",
    };
    const headers = {
      apiKey: "stjCiIZILvIZwTWJUTWxzE5ykPCe8s3p",
      accept: "application/json",
      Authorization: "Bearer " + bearerToken,
    };

    const res = await axios.get(tokenUrl, {
      params: queryParams,
      headers: headers,
    });

    console.log(res);

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

  console.log(response);
  return response;
};
