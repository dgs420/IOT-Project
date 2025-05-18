import React from 'react'
import HomeAdmin from "./Components/HomeAdmin.jsx";
import {ForbiddenPage} from "../Forbidden/index.jsx";


const Home = () => {
    const role = localStorage.getItem('role');

    return (
        <>
            {role === 'admin' ? (
                <HomeAdmin/>
            ) : (
                <ForbiddenPage/>
            )}
        </>
    );
};
export default Home
