export const TODO_LIST_ADDRESS = "0x2cb2D057C23e20AE69c4bf9d713bf8428Ac56f7C";
export const ADDRESS_STORAGE = "0x1415fb065166f3d19cec9ff438bbf0b0ffc3b254";

export const ABI_STORAGE = [
	{
		constant: false,
		inputs: [
			{
				name: "creator",
				type: "address"
			},
			{
				name: "contratto",
				type: "address"
			}
		],
		name: "addContract",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [
			{
				name: "contr",
				type: "address"
			}
		],
		name: "removeContract",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "getAllContracts",
		outputs: [
			{
				name: "",
				type: "address[]"
			},
			{
				name: "",
				type: "address[]"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];

export const TODO_LIST_ABI = [
	{
		constant: true,
		inputs: [],
		name: "minIcrement",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "buyer",
		outputs: [
			{
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "buyoutPrice",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "highestBidder",
		outputs: [
			{
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "highestBid",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "reservePrice",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "minBlocks",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				name: "_title",
				type: "string"
			},
			{
				name: "_URL",
				type: "string"
			},
			{
				name: "_reservePrice",
				type: "uint256"
			},
			{
				name: "_minIcrement",
				type: "uint256"
			},
			{
				name: "_buyoutPrice",
				type: "uint256"
			},
			{
				name: "_minBlocks",
				type: "uint256"
			}
		],
		payable: true,
		stateMutability: "payable",
		type: "constructor"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				name: "bidder",
				type: "address"
			},
			{
				indexed: false,
				name: "amount",
				type: "uint256"
			}
		],
		name: "HighestBidIncreased",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				name: "winner",
				type: "address"
			},
			{
				indexed: false,
				name: "amount",
				type: "uint256"
			}
		],
		name: "AuctionEnded",
		type: "event"
	},
	{
		constant: false,
		inputs: [],
		name: "openAuction",
		outputs: [],
		payable: false,
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		constant: false,
		inputs: [],
		name: "acquistoDiretto",
		outputs: [],
		payable: true,
		stateMutability: "payable",
		type: "function"
	},
	{
		constant: false,
		inputs: [],
		name: "bid",
		outputs: [],
		payable: true,
		stateMutability: "payable",
		type: "function"
	},
	{
		constant: false,
		inputs: [],
		name: "finalize",
		outputs: [],
		payable: true,
		stateMutability: "payable",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "getHighestBidder",
		outputs: [
			{
				name: "",
				type: "address"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "getHighestBid",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "getBuyoutPrice",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	},
	{
		constant: true,
		inputs: [],
		name: "getMinIncrement",
		outputs: [
			{
				name: "",
				type: "uint256"
			}
		],
		payable: false,
		stateMutability: "view",
		type: "function"
	}
];
