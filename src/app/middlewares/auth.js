const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const jwtVerifyAsync = promisify(jwt.verify);

module.exports = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		return res.status(401).json({ message: "Token not provided!" });
	}

	try {
		const [, token] = authHeader.split(" ");
		const decoded = await jwtVerifyAsync(token, process.env.JWT_SECRET);

		req.userId = decoded.id; // Set userId for all controllers identify the user

		return next();
	} catch (error) {
		return res.status(401).json({ message: "Invalid token!" });
	}
};
