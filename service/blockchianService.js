
import {getBalance, addTransaction} from "../respository/chain.js"
import { get, getAll, getByTime, create } from "../respository/dynamodb.js";

class ChainService {
    
    constructor() {
    
    }

    async save(event) {
      // const result = await create(event);
      const result = await addTransaction(event);
      return result;
    }
  
    async get(key) {
        console.log("key: " + key);
        // const result1 = await get(key);
      const result2 = await getBalance(key);
      return result2;
    }

    async getAll() {
        const result = await getAll();
        return result;
    }

    async getByTime(event) {
        const result = await getByTime(event);
        return result;
    }
  }
  
  const chainService = new ChainService();
  
  export { chainService };
  