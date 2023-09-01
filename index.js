import axios from "axios";

export const handler = async (event, context) => {
  try {
    const tokenUrl = "https://api.ariba.com/v2/oauth/token";
    const tokenQueryParams = {
      grant_type: "openapi_2lo",
    };
    const tokenHeaders = {
      apiKey: process.env.apiKey,
      accept: "application/json",
      Authorization: "Basic " + process.env.BASE64_ENCODED_CLIENT_SERVER,
    };

    const tokenResponse = await axios.post(tokenUrl, null, {
      params: tokenQueryParams,
      headers: tokenHeaders,
    });

    console.log("Token response:", tokenResponse.data);

    const pendingApprovables =
      "https://openapi.ariba.com/api/approval/v2/prod/pendingApprovables";
    const approvablesQueryParams = {
      realm: "WillScotMobileMini-1-T",
    };
    const approvablesHeaders = {
      apiKey: process.env.apiKey,
      accept: "application/json",
      Authorization: "Bearer " + tokenResponse.data.access_token,
    };

    const approvablesResponse = await axios.get(pendingApprovables, {
      params: approvablesQueryParams,
      headers: approvablesHeaders,
    });

    console.log(approvablesResponse.data)
    
    const firstApprovableUniqueName =
      approvablesResponse.data[0].approvableUniqueName;

    const approvalRequestEndpoint =
      "https://btus66kfq5eg3ilbwwms37pqwy.appsync-api.us-east-1.amazonaws.com/graphql";

    const approvalRequestMutation = `
      mutation ApprovalRequestHandler($payload: String) {
        approvalRequestHandler(payload: $payload)
      }
    `;

    const payload = JSON.stringify({
      externalId: "{{uuid}}",
      title: firstApprovableUniqueName,
    });

    const data = {
      query: approvalRequestMutation,
      variables: {
        payload: payload,
      },
    };

    const approvalRequestResponse = await axios.post(approvalRequestEndpoint, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("GraphQL API response:", approvalRequestResponse.data);

    return {
      statusCode: 200,
      body: JSON.stringify(approvalRequestResponse.data),
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
