const fetch = require("node-fetch");
const targetUrls = [
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
	"http://192.168.0.141",
];

async function sendRequest(targetUrl, data, method = "post") {
	const response = await fetch(targetUrl, {
		method: method,
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
	});
	return response.json();
}

const sendRequestInBatches = async (
	targetUrls,
	ipAddress,
	batchSizeLimit = 5
) => {
	// Split all targetUrls into batches
	let batches = [];
	while (targetUrls.length != 0) {
		batches.push(targetUrls.splice(0, batchSizeLimit));
	}
	// Processing in batches
	const processedBatches = await Promise.all(
		batches.map(async (batch) => {
			return await Promise.all(
				batch.map(async (targetUrl) => {
					return sendRequest(targetUrl, {
						ipAddress: ipAddress,
						timestamp: Date.now(),
					});
				})
			);
		})
	);
	// Merging batches into one array
	let mergedBatches = [].concat.apply([], processedBatches);
	return mergedBatches;
};

const dealwithshit = async () => {
	const answer = await sendRequestInBatches(targetUrls, "motherfucker");
	console.log(answer);
};
dealwithshit();
