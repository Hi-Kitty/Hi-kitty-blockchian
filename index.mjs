import { chainService} from "./service/blockchianService.js";


export const handler = async(event) => {
    console.log("request: ", JSON.stringify(event, undefined, 2));
    let body;
    try {
        switch (event.httpMethod) {
            case "GET":
                console.log("event.pathParmeters: " + event);
                if (event.queryStringParameters != null) {
                    body = await chainService.getByTime(event);
                }
                else if (event.pathParameters != null) {
                   body =  await chainService.get(event.pathParameters.key);
                } else {
                    body = await chainService.getAll();
                }
                break;
            case "POST":
                body = await chainService.save(event);
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`)
        }
        console.log("body: ", body);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Success ${event.httpMethod} method`,
                body: body
            })
        };
    } catch (error) {
        console.log("error: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Error ${event.httpMethod} method`,
                errorMsg: error.message,
                errorStack: error.stack
            })
        };
    }
};