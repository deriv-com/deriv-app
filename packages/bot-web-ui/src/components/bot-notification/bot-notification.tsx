import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ToastContainer } from 'react-toastify';
// eslint-disable-next-line import/no-extraneous-dependencies
import 'react-toastify/dist/ReactToastify.css';
import './bot-notification.scss';

const BotNotification = () => {
    return (
        <>
            <ToastContainer />
        </>
    );
};

export default BotNotification;
