import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import classes from "./auth-form.module.css";

function AuthForm() {
	const [isLogin, setIsLogin] = useState(true);
	const emailRef = useRef();
	const passwordRef = useRef();

	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}

	const submitHandler = async (e) => {
		e.preventDefault();
		const enteredEmail = emailRef.current.value;
		const enteredPassword = passwordRef.current.value;

		if (isLogin) {
			const result = await signIn("credentials", {
				redirect: false,
				email: enteredEmail,
				password: enteredPassword,
			});

			console.log(result);
		} else {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				body: JSON.stringify({
					email: enteredEmail,
					password: enteredPassword,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();

			console.log(data);
		}
	};
	return (
		<section className={classes.auth}>
			<h1>{isLogin ? "Login" : "Sign Up"}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" ref={emailRef} required />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" ref={passwordRef} required />
				</div>
				<div className={classes.actions}>
					<button type="submit">{isLogin ? "Login" : "Create Account"}</button>
					<button
						type="button"
						className={classes.toggle}
						onClick={switchAuthModeHandler}
					>
						{isLogin ? "Create new account" : "Login with existing account"}
					</button>
				</div>
			</form>
		</section>
	);
}

export default AuthForm;
