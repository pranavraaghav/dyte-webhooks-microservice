module.exports = async () => {
	try {
		const Webhook = require("./webhook");

		await Webhook.sync({ alter: true});
	} catch (error) {
		throw new Error(error);
	}
};
