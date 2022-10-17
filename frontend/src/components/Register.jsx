import React from "react";
import { useContext } from "react";
import { useState } from "react";

import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmpassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [, setToken] = useContext(UserContext);

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email, hashed_password: password })
        };

        const response = await fetch("/api/users", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            setToken(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword && password.length > 5) {
            submitRegistration();
        } else {
            setErrorMessage("Ensure that the passwords match and greater than 5 characters");
            console.log("error message", errorMessage)
        }
    }

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <lable className="label">Email Address</lable>
                    <div className="control">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input"
                            placeholder="Enter Email"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <lable className="label">Password</lable>
                    <div className="control">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="input"
                            placeholder="Enter Password"
                            required
                        />
                    </div>
                </div>

                <div className="field">
                    <lable className="label">Confirm Password</lable>
                    <div className="control">
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmpassword(e.target.value)}
                            className="input"
                            placeholder="Enter Confirm Password"
                            required
                        />
                    </div>
                </div>
                <ErrorMessage message={errorMessage} />
                <br />
                <button className="button is-primary" type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;