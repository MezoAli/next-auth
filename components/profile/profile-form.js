import { useRef } from "react";
import classes from "./profile-form.module.css";

function ProfileForm() {
	const oldPassword = useRef();
	const newPassword = useRef();

	const handleSubmit = (e) => {
		e.preventDefault();
		const enteredOldPassword = oldPassword.current.value;
		const enteredNewPassword = newPassword.current.value;

		fetch("/api/auth/changepassword", {
			method: "PATCH",
			body: JSON.stringify({
				oldPass: enteredOldPassword,
				newPass: enteredNewPassword,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => console.log(data));
	};
	return (
		<form className={classes.form} onSubmit={handleSubmit}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input type="password" id="new-password" ref={newPassword} />
			</div>
			<div className={classes.control}>
				<label htmlFor="old-password">Old Password</label>
				<input type="password" id="old-password" ref={oldPassword} />
			</div>
			<div className={classes.action}>
				<button type="submit">Change Password</button>
			</div>
		</form>
	);
}

export default ProfileForm;
