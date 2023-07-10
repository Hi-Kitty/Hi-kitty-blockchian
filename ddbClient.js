import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
const REGION = "ap-northeast-2";
const ddbClient = new DynamoDBClient({ region: REGION });

export { ddbClient };