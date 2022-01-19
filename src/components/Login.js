import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import UserContext from './UserContext';

function Login() {

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

    const history = useHistory();

    const userManager = useContext(UserContext);

    const submit = (event) => {
        event.preventDefault();

        fetch( "http://localhost:8080/api/security/authenticate",
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({username,password})
            }


        ).then(
            response => {
                if (response.status !== 200){
                    alert("Login failed");
                } else {
                    return response.json();
                }
            }
        ).then(
            parsedResponse => {

                const jwt = parsedResponse.jwt_token;

                localStorage.setItem("jwt_token",jwt);

                const userinfo = jwtDecode(jwt);

                userManager.setCurrentUser(userinfo);


                history.push("/");
            }
        );

    }

    const updateUsername = (event) => {
        setUsername(event.target.value);
    }

    const updatePassword = (event) => {
        setPassword(event.target.value);
    }

    return (
        <main>
            <form className="" onSubmit={submit}>

                <div className="form-group mt-2">
                    <label htmlFor="username">Username:</label>
                    <input className="form-control" id="username" name="username" onChange={updateUsername} placeholder="Enter username"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input className="form-control" id="password" name="password" type="password" onChange={updatePassword} placeholder="Enter password"/>
                </div>
                <button className="btn btn-primary mr-2">Log In</button>
                <a href="/register" className="vertical-middle">Create an account</a>

            </form>
        </main>
    )
}

export default Login;