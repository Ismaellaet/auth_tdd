const request = require("supertest");

const app = require("../../src/app");
const factory = require("../utils/factories");
const truncate = require("../utils/truncate");

describe("Authentication", () => {
	beforeEach(async () => {
		await truncate();
	});

	it("should authenticate with valid credentials", async () => {
		const user = await factory.create("User");

		const response = await request(app).post("/login").send({
			email: user.email,
			password: user.password,
		});

		expect(response.status).toBe(200);
	});

	it("should NOT authenticate with an invalid email", async () => {
		const user = await factory.create("User");

		const response = await request(app).post("/login").send({
			email: "invalid_email@email.com",
			password: user.password,
		});

		expect(response.status).toBe(401);
	});

	it("should NOT authenticate with an invalid password", async () => {
		const user = await factory.create("User");

		const response = await request(app).post("/login").send({
			email: user.email,
			password: "wrongpassword",
		});

		expect(response.status).toBe(401);
	});

	it("should get JWT token when authenticated", async () => {
		const user = await factory.create("User");

		const response = await request(app).post("/login").send({
			email: user.email,
			password: user.password,
		});

		expect(response.body).toHaveProperty("token");
	});

	it("should be able to access private routes when authenticated", async () => {
		const user = await factory.create("User");

		const response = await request(app)
			.get("/dashboard")
			.set("Authorization", `Bearer ${user.generateToken()}`);

		expect(response.status).toBe(200);
	});

	it("should NOT be able to access private routes whithout JWT token", async () => {
		const response = await request(app).get("/dashboard");

		expect(response.status).toBe(401);
	});

	it("should NOT be able to access private routes with invalid JWT token", async () => {
		const response = await request(app)
			.get("/dashboard")
			.set("Authorization", `Bearer invalidToken1123`);

		expect(response.status).toBe(401);
	});
});
