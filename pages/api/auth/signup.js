import { MongoClient } from "mongodb";
import { hash } from "bcryptjs";

async function handler(req, res) {
	let client;
	const { email, password } = req.body;
	if (
		!email ||
		!email.includes("@") ||
		!password ||
		password.trim().length < 7
	) {
		res.status(422).json({ message: "invalid inputs" });
	}
	try {
		client = await MongoClient.connect(
			"mongodb+srv://moutazali:1234567890@cluster0.vebfjx8.mongodb.net/users?retryWrites=true&w=majority"
		);
	} catch (error) {
		res
			.status(500)
			.json({ message: error.message || "failed to connect to databse" });
		return;
	}

	try {
		const db = client.db();

		const existingUser = await db.collection("authusers").findOne({ email });

		if (existingUser) {
			res.status(422).json({ message: "user already exists" });
			return;
		}

		const hashedPassword = await hash(password, 12);

		await db.collection("authusers").insertOne({
			email,
			password: hashedPassword,
		});
	} catch (error) {
		res.status(500).json({ message: error.message || "failed to insert data" });
		return;
	}

	res.status(201).json({ message: "created User" });

	client.close();
}

export default handler;
