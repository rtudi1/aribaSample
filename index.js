import axios from "axios";
import { SignatureV4 } from '@aws-sdk/signature-v4';
import { Sha256 } from '@aws-crypto/sha256-js';

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

    // console.log("Token response:", tokenResponse.data);

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

    const approvalRequestEndpoint =
      "https://btus66kfq5eg3ilbwwms37pqwy.appsync-api.us-east-1.amazonaws.com/graphql";

    const approvalRequestMutation = `
      mutation ApprovalRequestHandler($payload: String) {
        approvalRequestHandler(payload: $payload)
      }
    `;


    const payload = {
      data: [{name: '', value: ''}],
      errorCount: 0,
      errorMessage: "",
      externalId: "{{uuid}}",
      lineItems: [{
        attachments: [],
        data:[{name: 'Quantity', value: '1 each'}],
        icon:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRy81pnRNpXgy1DhtjgPIuvOFyNll-tffJYzZH6L7XcRT7s24hAHz4niPspT8u1jr-4aJY&usqp=CAU",
        notes:"",
        read:false,
        title:"UI/UX"
    }],
      notes:"{{currentDateTime}}",
      read: false,
      recipient: "cgowda@mobilemini",
      status: "Open",
      submittedBy:"Chandan Gowda",
      submittedDate:"{{current_timestamp}}",
      sync:false,
      system:"TIME OFF",
      title:"{{current_timestamp}}"
    }
    
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
      body: "Success"
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "An error occurred" }),
    };
  }
};
