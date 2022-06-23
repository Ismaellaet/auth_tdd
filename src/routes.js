const routes = require("express").Router();
const { User } = require("./app/models");

User.create({
	name: "Ismael",
	email: "ismaellaet@gmail.com",
	password_hash: "1234566777887",
});

module.exports = routes;
