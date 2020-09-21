import React from 'react';
import ReactDOM from 'react-dom';
import PlatformContainer from './App/Containers/PlatformContainer';
import App from './App/app.jsx';

const Platform = () => {
    return (
        <PlatformContainer>
            <App />
        </PlatformContainer>
    );
};

const wrapper = document.getElementById('deriv_app');
// eslint-disable-next-line no-unused-expressions
wrapper ? ReactDOM.render(<Platform />, wrapper) : false;
