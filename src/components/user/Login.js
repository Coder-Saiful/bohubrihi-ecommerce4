import React, {useState} from 'react';
import Layout from '../Layout';
import {login} from '../../api/apiAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom';
import { authenticate, userInfo, isAuthenticated } from '../../utils/auth';

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: false,
        redirect: false,
        disabled: false
    });

    const {email, password, error, redirect, disabled} = values;

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({
            ...values,
            disabled: true
        });
        const submitBtn = document.querySelector('.submitBtn');
        submitBtn.textContent = "";
        submitBtn.classList.add('loading');

        login({email: email, password: password})
            .then(response => {
                authenticate(response.data.token, () => {
                    setValues({
                        ...values,
                        email: '',
                        password: '',
                        disabled: false,
                        error: false,
                        redirect: true
                    });
                    submitBtn.textContent = "Login";
                    submitBtn.classList.remove('loading');
                });
            })
            .catch(err => {
                if (err.response) {
                    setValues({
                        ...values,
                        disabled: false,
                        error: err.response.data
                        
                    });
                
                    submitBtn.textContent = "Login";
                    submitBtn.classList.remove('loading');
                } else {
                    
                    if (navigator.onLine) {
                        setValues({
                            ...values,
                            disabled: false,
                            error: false
                        });
        
                        submitBtn.textContent = "Login";
                        submitBtn.classList.remove('loading');
    
                        toast.error(`Login failed! Please try again.`, {
                            autoClose: 3000
                        });
                    } else {
                        setValues({
                            ...values,
                            disabled: false,
                            error: false
                        });
        
                        submitBtn.textContent = "Login";
                        submitBtn.classList.remove('loading');
    
                        toast.error(`Internet connection failed!`, {
                            autoClose: 3000
                        });
                    }
                }
            });
    }

    const redirectUser = () => {
        if (redirect) {
            return <Redirect to={`/${userInfo().role}/dashboard`} />
        }
        if (isAuthenticated()) {
            return <Redirect to='/' />
        }
    }

    return (
        <Layout title='Login' classname='container'>
            <ToastContainer />
            {redirectUser()}
            <div className="row">
                <div className="col-lg-7 col-md-10 m-auto">
                    <form className='loginForm' onSubmit={handleSubmit}>
                        <h1>Login Here</h1>
                        <div className="mb-3">
                            <label className="form-label">Email address</label>
                            <input type="text" className='form-control' name='email' value={email} onChange={handleChange} />
                            <div className="text-danger">{error.email ? error.email : ''}</div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input type="password" className='form-control' name='password' value={password} onChange={handleChange} />
                            <div className="text-danger">{error.password ? error.password : ''}</div>
                        </div>
                        <button type="submit" disabled={disabled} className="submitBtn">Login</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Login;