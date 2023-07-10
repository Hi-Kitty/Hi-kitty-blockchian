import { GetItemCommand, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "../ddbClient.js";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const get = async (key) => {
    console.log("get: ", key);
    
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ key: key })
        };
        const {Item} = await ddbClient.send(new GetItemCommand(params));
        console.log("Success: ", Item);
        return (Item) ? unmarshall(Item) : {};
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

const getAll = async () => {
    console.log("getAll");
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME
        };
        const {Items} = await ddbClient.send(new ScanCommand(params));
        console.log("Success: ", Items);
        return (Items) ? Items.map((item) => unmarshall(item)) : {}; 
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

const getByTime = async (event) => {
    console.log("getByTime: ", event.queryStringParameters);
    try {
        const key = event.pathParameters.key;
        const timestamp = event.queryStringParameters.timestamp;
        const params = {
            KeyConditionExpression: "key = :key",
            FilterExpression: "contains(timestamp, :timestamp)",
            ExpressionAttributeValues: {
                ":key": { S: key },
                ":timestamp": { S: timestamp }
            },
            TableName: process.env.DYNAMODB_TABLE_NAME
        };
        const {Items} = await ddbClient.send(new QueryCommand(params));
        console.log("Success: ", Items);
        return (Items) ? Items.map((item) => unmarshall(item)) : {};
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

const create = async (event) => {
    console.log("create: ", event.body);
    try {
        const requestBody = JSON.parse(event.body);
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(requestBody || {})
        };
        const result = await ddbClient.send(new PutItemCommand(params));
        console.log("Success: ", result);
        return result;
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
}

export { get, getAll, getByTime, create };