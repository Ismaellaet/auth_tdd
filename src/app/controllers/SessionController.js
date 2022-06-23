const { User } = require("../models");

class SessionController {
	async login(req, res) {
		const { email, password } = req.body;

		const user = await User.findOne({ where: { email } });

		// Check if user exists
		if (!user) {
			return res.status(401).json({ message: "User not found!" });
		}

		const invalidPassword = !(await user.checkPassword(password));

		if (invalidPassword) {
			return res.status(401).json({ message: "Invalid password!" });
		}

		return res.status(200).json({
			user,
			token: user.generateToken(),
		});
	}
}

module.exports = new SessionController();
