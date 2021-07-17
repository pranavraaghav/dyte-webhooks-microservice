const sequelize = require("sequelize");
const db = require("../database/connection");

const schema = {
	id: {
		type: sequelize.UUID,
		primaryKey: true,
	},
	targetUrl: {
		type: sequelize.TEXT,
		allowNull: false,
	},
};

const options = {timestamps: false};

const Webhook = db.define("Webhook", schema, options);

module.exports = Webhook;
