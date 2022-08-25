import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Main from "../Main";
import ReactDOM from 'react-dom';
import Layout from "../components/Layout";
import axios from 'axios';
import $ from 'jquery';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginUser = async () => {
        var errorMessage = false;

        await axios.post(`/api/login_check`, {
            username: username,
            password: password
        }).then(function(response) {
            window.localStorage.setItem('token', response.data.token);
        }).catch(function(errorResponse) {
            errorMessage = setErrorMessage(errorResponse, errorMessage);
        });

        if (errorMessage == false) {
            await deleteErrorMessage();
            await ReactDOM.render(<Main />, document.getElementById('app'));
            await navigate('product/list');
        }
    }

    function setErrorMessage(errorResponse, errorMessage) {
        $('#error-message').removeClass('d-none');
        $('#error-message').html('').append(errorResponse.response.data.message);
        return errorMessage = true;
    }
 
    function deleteErrorMessage() {
        $('#error-message').addClass('d-none');
        $('#error-message').html('');
    }

    return (
        <Layout>
            <div className="container">
                    <div className="row justify-content-center mt-5">
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <div className="card shadow">
                                <div className="card-body">
                                    <form>
                                        <div className="mb-4">
                                            <label htmlFor="username" className="form-label">Email</label>
                                            <input 
                                                type="text" 
                                                onChange={(event)=>{setUsername(event.target.value)}}
                                                value={username}
                                                className="form-control"
                                                id="username" />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input 
                                                type="password"
                                                onChange={(event)=>{setPassword(event.target.value)}}
                                                value={password}
                                                className="form-control" 
                                                id="password" />
                                        </div>
                                        <div className="d-grid mb-2">
                                            <button 
                                                type="button"
                                                onClick={loginUser} 
                                                className="btn btn-lg btn-primary"
                                                >Login
                                            </button>
                                        </div>
                                        <div id="error-message" className="alert alert-danger d-none"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </Layout>
    );
}
  
export default Login;