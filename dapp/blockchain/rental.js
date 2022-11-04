const ABI = [
	{
		"inputs": [],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_tenant",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "createContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_damageValue",
				"type": "uint256"
			}
		],
		"name": "damageClaim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "leaseContracts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "landlord",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "tenant",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "claimValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "propertyId",
				"type": "uint256"
			},
			{
				"internalType": "enum RentalDeposit.State",
				"name": "state",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "releaseDeposit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "requestDeposit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_landlordAddress",
				"type": "address"
			}
		],
		"name": "tenantAccept",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_propertyId",
				"type": "uint256"
			}
		],
		"name": "tenantTerminate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const rentalDepositContract = web3 => {
  return new web3.eth.Contract(
    ABI,
    "0xb0F2b3d7B5fB86a322696e956defEBb575DBb6a0"
  )
}
export default rentalDepositContract

