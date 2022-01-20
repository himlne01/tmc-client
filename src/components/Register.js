import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import jwtDecode from "jwt-decode";
import UserContext from './UserContext';

function Register() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [messages, setMessages] = useState([]);

    const history = useHistory();

    const submit = (event) => {
        event.preventDefault();
        console.log(JSON.stringify({username,password}));
        fetch(`${process.env.REACT_APP_API_HOST}/api/security/create_account`,
            {
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({username,password})
            }


        ).then(
            response => {
                if (response.status !== 201){
                    response.json().then(body => {setMessages(body); alert(body)});
                } else {
                    return response.json();
                }
            }
        ).then(

                history.push("/Login")
            
        );

    }

    const updateUsername = (event) => {
        setUsername(event.target.value);
    }

    const updatePassword = (event) => {
        setPassword(event.target.value);
    }

    const updateConfirmPassword = (event) => {
        setConfirmPassword(event.target.value);
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
            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input className="form-control" id="confirmPassword" name="confirmPassword" type="password" onChange={updateConfirmPassword} placeholder="Confirm password"/>
            </div>
            <button className="btn btn-primary mr-2">Create Account</button>
            <a href="/login" className="vertical-middle">Sign into an existing account</a>
        </form>
        <ul>
            {messages.map((message) => <li style={{ color: 'red' }} key={message}>{message} </li>)}
        </ul>
    </main>

    )
}

export default Register;