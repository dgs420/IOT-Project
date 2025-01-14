import React, {useEffect, useState} from 'react'
import HomeAdmin from "./Components/HomeAdmin.jsx";
import HomeUser from "./Components/HomeUser.jsx";


const Home = () => {
    const role = localStorage.getItem('role');

    return (
        <>
            {role === 'admin' ? (
                <HomeAdmin/>
            ) : (
                <HomeUser/>
            )}
        </>
    );
};
export default Home
