const Webhook = require("../models/webhook");
const db = require("../database/connection");
const uuid4 = require("uuid4");
const fetch = require("node-fetch");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "webhooks",

	/**
	 * Actions
	 */
	actions: {
		register: {
			params: {
				targetUrl: { type: "url" },
			},
			async handler(ctx) {
				try {
					const createdWebhook = await Webhook.create({
						id: uuid4(),
						targetUrl: ctx.params.targetUrl,
					});
					return {
						code: 200,
						id: createdWebhook.id,
					};
				} catch (error) {
					return {
						code: 500,
					};
				}
			},
		},
		update: {
			params: {
				id: { type: "string" },
				newTargetUrl: { type: "url" },
			},
			async handler(ctx) {
				try {
					const webhook = await Webhook.findOne({
						where: { id: ctx.params.id },
					});

					if (webhook) {
						webhook.targetUrl = ctx.params.newTargetUrl;
						await webhook.save();
						return {
							code: 204,
						};
					}
					return {
						code: 404,
					};
				} catch (err) {
					return {
						code: 500,
					};
				}
			},
		},
		list: {
			async handler() {
				try {
					const webhooks = await Webhook.findAll();
					// Processing the response structure before sending
					const listOfWebhooks = [];
					webhooks.forEach((webhook) => {
						listOfWebhooks.push(webhook.dataValues);
					});
					return {
						code: 200,
						webhooks: listOfWebhooks, // Returns empty if there are no entries
					};
				} catch (error) {
					return { code: 500 };
				}
			},
		},
		delete: {
			params: {
				id: { type: "string" },
			},
			async handler(ctx) {
				try {
					const webhook = await Webhook.findOne({
						where: { id: ctx.params.id },
					});
					if (webhook) {
						await webhook.destroy();
						return {
							code: 200,
						};
					}
					return {
						code: 404,
					};
				} catch (error) {
					return {
						code: 500,
						message: error.toString(),
					};
				}
			},
		},
		trigger: {
			params: {
				ipAddress: { type: "string" },
			},
			async handler(ctx) {
				try {
					// Fetch all targetUrls
					const targetUrls = await Webhook.findAll().then(
						(webhooks) => {
							const list = [];
							webhooks.forEach((webhook) => {
								list.push(webhook.targetUrl);
							});
							return list;
						}
					);
					const responses = await this.sendRequestInBatches(
						targetUrls,
						ctx.params.ipAddress
					);
					return {
						code: 200,
						responses: responses,
					};
				} catch (error) {
					return {
						code: 500,
						error: error,
					};
				}
			},
		},
	},

	methods: {
		/**
		 * An abstraction of sending a POST request
		 * Exists to keep code clean
		 * 
		 * NOTE: All requests will have a timeout of 4s 
		 */
		async sendRequest(targetUrl, data, method = "post") {
			try {
				return fetch(targetUrl, {
					method: method,
					body: JSON.stringify(data),
					headers: { "Content-Type": "application/json" },
					timeout: 4000
				})
					.then((res) => res.json())
					.catch((err) => console.log(err));
			} catch (error) {
				throw error;
			}
		},

		/**
		 * This approach splits all targetUrls into batches of size batchSizeLimit
		 * and requests each batch in parallel.
		 * The next batch is executed only after all the requests in the current
		 * batch have been resolved.
		 *
		 * One disadvantage here is that the time taken to finish a batch is
		 * determined by the slowest request in the batch.
		 */
		async sendRequestInBatches(targetUrls, ipAddress, batchSizeLimit = 10) {
			try {
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
								return this.sendRequest(targetUrl, {
									ipAddress: ipAddress,
									timestamp: Date.now(),
								});
							})
						);
					})
				);
				// Merging batches into one array
				let mergedResponses = [].concat.apply([], processedBatches);
				return mergedResponses;
			} catch (error) {
				throw error;
			}
		},

		/**
		 * Sends out all the requests parallely
		 * "Parallel" here is sending a request
		 * without waiting for a response from the previous request
		 *
		 * This works just fine if each targetUrl is unique
		 * However, if a lot of requests go to a single endpoint,
		 * the server might block us for sending in
		 * potentially 100+ requests in a short period of time.
		 */
		async sendRequestsInParallel(targetUrls, ipAddress) {
			targetUrls.forEach((targetUrl) => {
				const data = {
					ipAddress: ipAddress,
					timestamp: Date.now(),
				};
				this.sendRequest(targetUrl, data);
			});
		},
	},

	// Run migrations when Service is created.
	created() {
		// Testing connection to db
		db.authenticate()
			.then(() => {
				console.log("Connected to DB successfully");
			})
			.catch((err) => {
				console.log("Error connecting to DB");
				console.log(err.toString());
			});
		const migrations = require("../models/migrations");
		migrations()
			.then(() => console.log("Migrations made"))
			.catch((err) => console.log(err));
	},
};
