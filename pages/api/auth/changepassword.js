import { compare, hash } from "bcryptjs";
import { MongoClient } from "mongodb";
import { getSession } from "next-auth/react";
async function handleChangePassword(req, res) {
	if (req.method !== "PATCH") {
		return;
	}
	const session = await getSession({ req: req });
	if (!session) {
		res.status(401).json({ message: "authenication is missing" });
		return;
	}
	const userEmail = session.user.email;

	const { oldPass, newPass } = req.body;

	if (!oldPass || oldPass.length < 7 || !newPass || newPass.length < 7) {
		res.status(422).json({ message: "invalid data" });
		return;
	}

	const client = await MongoClient.connect(
		"mongodb+srv://moutazali:1234567890@cluster0.vebfjx8.mongodb.net/users?retryWrites=true&w=majority"
	);

	const db = client.db();

	const existingUser = await db
		.collection("authusers")
		.findOne({ email: userEmail });

	if (!existingUser) {
		res.status(404).json({ message: "can't find user" });
		return;
	}

	const isValidPassword = await compare(oldPass, existingUser.password);

	if (!isValidPassword) {
		res.status(422).json({ message: "user inputs are incorrect" });
		return;
	}

	const newHashPassword = await hash(newPass, 12);

	await db
		.collection("authusers")
		.updateOne({ email: userEmail }, { $set: { password: newHashPassword } });

	res.status(200).json({ message: "successfully update password" });

	client.close();
}

export default handleChangePassword;
