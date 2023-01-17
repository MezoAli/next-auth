import { useSession, getSession } from "next-auth/react";
// import { useState } from "react";
// import { useEffect } from "react";
import UserProfile from "../components/profile/user-profile";

function ProfilePage() {
	// const [loadedSession, setLoadedSession] = useState();
	// const [loading, setLoading] = useState(true);
	// useEffect(() => {
	// 	setLoading(true);
	// 	getSession().then((session) => {
	// 		if (!session) {
	// 			window.location.href = "/auth";
	// 		} else {
	// 			setLoadedSession(session);
	// 			setLoading(false);
	// 		}
	// 	});
	// }, []);
	// const { data: session, status } = useSession();
	// if (status === "loading") {
	// 	return <p>Loading...</p>;
	// }
	// if (loading) {
	// 	return <p>Loading...</p>;
	// }
	// if (status === "unauthenticated") {
	// 	return <p>You Have To Login First !!!</p>;
	// }
	// if (status === "authenticated") {
	// 	return <UserProfile />;
	// }
	return <UserProfile />;
}

export async function getServerSideProps(context) {
	const session = await getSession({ req: context.req });

	if (!session) {
		return {
			redirect: {
				destination: "/auth",
				permanent: false,
			},
		};
	}

	return {
		props: { session },
	};
}

export default ProfilePage;
