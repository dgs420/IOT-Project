import React from 'react'
import HomeAdmin from "./Components/HomeAdmin.jsx";
import {ForbiddenPage} from "../Forbidden/index.jsx";
import useUserStore from '../../store/useUserStore.js';


const Home = () => {
    const {role} = useUserStore.getState();

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
