const express = require("express");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "express-gateway",
	settings: {
		port: process.env.PORT || 5000,
	},
	methods: {
		initializeRoutes(app) {
			app.post("/create", async (req, res) => {
				const response = await this.createWebhook(req.body.targetUrl);
				res.status(response.code).send(response);
			});
			app.get("/read", async (req, res) => {
				const response = await this.readWebhooks();
				res.status(response.code).send(response);
			});
			app.put("/update", async (req, res) => {
				const response = await this.updateWebhook(
					req.body.id,
					req.body.newTargetUrl
				);
				res.status(response.code).send(response);
			});
			app.delete("/delete", async (req, res) => {
				const response = await this.deleteWebhook(req.body.id);
				res.status(response.code).send(response);
			});
			app.post("/ip");
		},

		async createWebhook(targetUrl) {
			return await this.broker.call("webhooks.register", {
				targetUrl: targetUrl,
			});
		},

		async readWebhooks() {
			return await this.broker.call("webhooks.list");
		},

		async updateWebhook(id, newTargetUrl) {
			return await this.broker.call("webhooks.update", {
				id: id,
				newTargetUrl: newTargetUrl,
			});
		},

		async deleteWebhook(id) {
			return await this.broker.call("webhooks.delete", {
				id: id,
			});
		},
	},
	// Creating the actual server and having it listen to a port
	created() {
		const app = express();
		app.use(express.json());
		this.initializeRoutes(app);
		app.listen(this.settings.port, () => {
			console.log("STARTING SERVER");
		});
	},
};
