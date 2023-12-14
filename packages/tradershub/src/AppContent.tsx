import React from 'react';
import { Router } from './routes';
import './AppContent.scss';

const AppContent = () => {
    return (
        <div className='traders-hub-app'>
            <Router />
        </div>
    );
};

export default AppContent;
