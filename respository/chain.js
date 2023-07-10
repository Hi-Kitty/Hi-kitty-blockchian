import Web3 from 'web3';

// initiate the web3
const web3 = new Web3(process.env.PROVIDER);

// Set the private key for your wallet - 내 키
const privateKey = process.env.PRIVATE_KEY;

const accountPassword = process.env.ACCOUNT_PASSWORD;
const contractAddress = process.env.CONTRACT_ADDRESS;
console.log("privateKey: " + privateKey);
// Create an account from the private key
const account = web3.eth.accounts.privateKeyToAccount("0x"+ privateKey);
console.log("acount.address: " + account.address);
const contractABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_key",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_donorName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_fundraiserName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_timestamp",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_amount",
                "type": "uint256"
            }
        ],
        "name": "addTransaction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "map_trade",
        "outputs": [
            {
                "internalType": "string",
                "name": "donorName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "fundraiserName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "timestamp",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_key",
                "type": "string"
            }
        ],
        "name": "view_map",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "donorName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "fundraiserName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "timestamp",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DonationContract.Trade[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

// Create an instance of the contract
const contract = new web3.eth.Contract(contractABI, contractAddress);

async function getBalance(key) {
    
    const _result = await contract.methods.view_map(key).call({from: process.env.WALLET_ADDRESS})
    console.log("result");
    console.log(_result);
    
    const result = {};
    
    _result.map((item) => {
        result.amount = Number(item.amount.toString());;
        result.donorName = item.donorName;
        result.fundraiserName = item.fundraiserName;
        result.timestamp = item.timestamp;
    });
    return result;
}

async function addTransaction(event) {
       const { key, donorName, fundraiserName, timestamp, amount} = JSON.parse(event.body);
    console.log("inputs:" + key+ ": " + donorName + ":" + fundraiserName + ":" + timestamp + ":" + amount);
    const data = web3.eth.abi.encodeFunctionCall({
        name: 'addTransaction',
        type: 'function',
        inputs: [{
            type: 'string',
            name: '_key'
        },
        {
            type: 'string',
            name: '_donorName'
        },
        {
            type: 'string',
            name: '_fundraiserName'
        },
        {
            type: 'string',
            name: '_timestamp'
        },
        {
            type: 'uint256',
            name: '_amount'
        }]
    }, [key, donorName, fundraiserName, timestamp, amount]);

    const gasEstimate = await web3.eth.estimateGas({
        from: process.env.WALLET_ADDRESS,
        to: contractAddress,
        data: data
    });

    const tx = {
        gas: gasEstimate,
        gasPrice: web3.utils.toWei('100', 'gwei'),
        to: contractAddress,
        from: process.env.WALLET_ADDRESS,
        data: data,
        value:0x0
    }
    const signed = await web3.eth.accounts.signTransaction(tx, privateKey);
    const result = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log(result);
}


export { web3, addTransaction, getBalance };