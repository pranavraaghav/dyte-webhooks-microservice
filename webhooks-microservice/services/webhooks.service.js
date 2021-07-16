const Webhook = require("../models/webhook");
const db = require("../database/connection");
const uuid4 = require("uuid4");
const axios = require("axios");
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
			// params: {
			// 	ipAddress: { type: "url" },
			// },
			async handler() {
				// Fetch all targerUrls
				const targetUrls = await Webhook.findAll().then((webhooks) => {
					const list = [];
					webhooks.forEach((webhook) => {
						list.push(webhook.targetUrl);
					});
					return list;
				});
				console.log(targetUrls);
				this.massTriggerUrl(targetUrls, { ipAddress: "192.168.0.1"});
			},
		},
	},

	methods: {
		/**
		 * 
		 */
		async massTriggerUrl(targetUrls, data) {
			targetUrls.forEach((targetUrl) => {
				data.timestamp = Date.now();
				axios
					.post(targetUrl, data)
					.then((res) => {
						console.log(`Status: ${res.status}`);
					})
					.catch((err) => {
						console.log(err);
					});
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
