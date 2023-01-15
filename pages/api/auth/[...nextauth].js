import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";

export const authOptions = {
	// session: {
	// 	jwt: true,
	// },
	providers: [
		CredentialsProvider({
			name: "Credentials",

			async authorize(credentials, req) {
				const client = await MongoClient.connect(
					"mongodb+srv://moutazali:1234567890@cluster0.vebfjx8.mongodb.net/users?retryWrites=true&w=majority"
				);
				const db = client.db();

				const user = await db
					.collection("authusers")
					.findOne({ email: credentials.email });

				if (!user) {
					throw new Error("no user found");
				}

				const isValidPassword = await compare(
					credentials.password,
					user.password
				);

				if (!isValidPassword) {
					throw new Error("wrong password");
				}

				return {
					email: user.email,
					password: user.password,
				};
			},
		}),
	],
};

export default NextAuth(authOptions);
