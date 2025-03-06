import styled from "../styles/Login.module.css";
import React, { useState, FormEvent } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';


interface LoginProps {
    toggle: () => void;
}

export function Login(props: LoginProps) {
    // const Login = (props: LoginProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    function handleLogin(e: FormEvent) {
        e.preventDefault();
        const DUMMY_USERNAME = 'admin';
        const DUMMY_PASSWORD = 'password123';

        // Check if entered credentials match the dummy credentials
        if (username === DUMMY_USERNAME && password === DUMMY_PASSWORD) {
            // Handle successful login
            props.toggle();
            navigate('/adminhome');
            if (auth) {
                auth.login();
            }

        } else {
            // Handle failed login
            console.log('Login failed');
            setErrorMessage('Invalid username or password');
        }
    }

    return (
        <div className={styled.popup}>
            <div className={styled.popupinner}>
                <h2 className={styled.labelcolor}><b>Admin Login</b></h2>
                <form onSubmit={handleLogin} className={styled.forms}>
                    <div className="form-group">
                        <label className={styled.labelcolor}><i>Username:</i></label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} className={styled.inputs} />
                    </div>
                    <div className="form-group">
                        <label className={styled.labelcolor}><i>Password:</i></label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className={styled.inputs} />
                    </div>
                    <button type="submit" className={styled.buttons}>Login</button>
                    <button onClick={props.toggle}>Close</button>
                </form>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {/* <button onClick={props.toggle}>Close</button> */}
            </div>
        </div>
    );
};

export default Login;