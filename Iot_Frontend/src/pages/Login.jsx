import React from 'react'
import parkingImage from '../assets/parking-management-system.jpeg';

const Login = () => {
    return (
        <div className='w-full h-screen flex items-start'>
            <div className='relative w-1/2 h-full flex flex-col'>
                <div className='absolute inset-0 flex flex-col justify-center items-center'>
                    <h1 className='text-4xl text-white font-bold my-4'>Barrier Management System</h1>

                </div>
                <img src={parkingImage} alt="back ground" className='w-full h-full object-cover' />

            </div>

            <div className='w-1/2 h-full bg-slate-200 flex flex-col p-20 justify-center'>
                {/* <h1>interactive band</h1> */}
                <div className='w-full flex flex-col'>
                    <div className='w-full flex flex-col'>
                        <h3 className='text-2xl font-semibold mb-4'>Welcome back</h3>
                        <p className='text-sm mb-2'>Login to continue</p>
                    </div>

                    <div className='w-full flex flex-col'>
                        <input
                            type='email'
                            placeholder='Email'
                            className='w-full text-black py-4 bg-transparent border-b border-gray-400 outline-none focus:border-black transition duration-200 ease-in-out' />
                        <input
                            type='password'
                            placeholder='Password'
                            className='w-full text-black py-4 bg-transparent border-b border-gray-400 outline-none focus:border-black transition duration-200 ease-in-out' />
                    </div>

                    <div className='w-full flex flex-col my-4'>
                        <button className='w-full text-white my-2 bg-black rounded-md p-5 text-center flex items-center justify-center transition duration-300 ease-in-out transform hover:bg-gray-800 '>
                            Log in
                        </button>
                        <button className='w-full text-black my-2 bg-white rounded-md p-5 text-center flex items-center justify-center border border-black transition duration-300 ease-in-out transform hover:bg-gray-100'>
                            Register
                        </button>
                    </div>



                </div>

                <div className='w-full my-4'>
                    <p className='text-sm font-normal text-black'>Don't have an account? <span className='font-semibold underline underline-offset-2 cursor-pointer'>Sign up</span></p>
                </div>

            </div>


        </div>
    )
}

export default Login
