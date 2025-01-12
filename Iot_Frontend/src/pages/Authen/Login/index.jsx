import React, { useState } from 'react'
import parkingImage from '../../../assets/parking-management-system.jpeg';

const Login = () => {
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            if(response.ok) {
                window.location.href = '/';
            }
            const data = await response.json();

            // Extract token, uid, and role from the parsed data
            const { token } = data.info;
            const { uid } = data.info; // use uid directly from data.info
            const { role } = data.info; // use role directly from data.info
            const { username } = data.info;

            // Store the JWT and user information securely
            localStorage.setItem('token', token);
            localStorage.setItem('uid', uid);
            localStorage.setItem('role', role);
            localStorage.setItem('username',username);
            // Redirect user to a dashboard or protected route
        } catch (error) {
            setError(error.message);
        }
    };
    return (
        <div className='w-full h-screen flex items-start'>
            <div className='relative w-1/2 h-full flex flex-col'>
                <div className='absolute inset-0 flex flex-col justify-center items-center'>
                    <h1 className='text-4xl text-white font-bold my-4 bg-black bg-opacity-50 p-2 rounded shadow-lg'>
                        Entry Management System
                    </h1>
                </div>
                <img src={parkingImage} alt="back ground" className='w-full h-full object-cover'/>

            </div>

            <div className='w-1/2 h-full bg-slate-200 flex flex-col p-20 justify-center'>
                {/* <h1>interactive band</h1> */}
                <div className='w-full flex flex-col'>
                    <div className='w-full flex flex-col'>
                    <h3 className='text-2xl font-semibold mb-4'>Welcome back</h3>
                        <p className='text-sm mb-2'>Login to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className='w-full flex flex-col'>
                        <input
                            type='email'
                            placeholder='Username'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full text-black py-4 bg-transparent border-b border-gray-400 outline-none focus:border-black hover:border-black transition duration-200 ease-in-out'/>
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full text-black py-4 bg-transparent border-b border-gray-400 outline-none focus:border-black hover:border-black transition duration-200 ease-in-out'/>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <div className='w-full flex flex-col my-4'>
                            <button
                                type='submit'
                                className='w-full text-white my-2 bg-black rounded-md p-5 text-center flex items-center justify-center transition duration-300 ease-in-out transform hover:bg-gray-800 '>
                                Log in
                            </button>
                            <button
                                className='w-full text-black my-2 bg-white rounded-md p-5 text-center flex items-center justify-center border border-black transition duration-300 ease-in-out transform hover:bg-gray-100'>
                                Register
                            </button>
                        </div>
                    </form>


                </div>

                <div className='w-full my-4'>
                    <p className='text-sm font-normal text-black'>Don&#39;t have an account? <span
                        className='font-semibold underline underline-offset-2 cursor-pointer'>Sign up</span></p>
                </div>

            </div>


        </div>
    )
}

export default Login
