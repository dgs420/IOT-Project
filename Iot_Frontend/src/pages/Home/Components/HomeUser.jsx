import React, {useEffect, useState} from 'react'
import {fetchData} from "../../../api/fetchData.js";
// import {getRequest} from "../../api/index.jsx";


const HomeUser = () => {
    const [homeData, setHomeData] = useState({
        "total_vehicles": 0,
        "vehicles_in": 0,
        "vehicles_exited": 0
    });

    useEffect(() => {
        void fetchData('/home', setHomeData, null, null);
    }, []);
    return (
        <div className='px-3 py-3'></div>
    );
};

export default HomeUser
