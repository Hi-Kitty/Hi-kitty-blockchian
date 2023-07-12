
import {getBalance, addTransaction} from "../respository/chain.js"

class ChainService {
    
    constructor() {
    
    }

    async save(event) {
      const result = await addTransaction(event);
      return result;
    }
  
    async get(key) {
      const result2 = await getBalance(key);
      return result2;
    }
  }
  
  const chainService = new ChainService();
  
  export { chainService };
  