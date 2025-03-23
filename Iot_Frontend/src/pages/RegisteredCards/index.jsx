import React, {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import {Box, Button, Card, CardContent, CardHeader, Modal, TextField} from "@mui/material";
import {getRequest,postRequest} from "../../api/index.js";

const RegisteredCards = () => {


    useEffect(() => {

    }, );

    return (
        <div className={'w-full p-4'}>
            Registered cards
        </div>

    )
        ;
};

export default RegisteredCards;
