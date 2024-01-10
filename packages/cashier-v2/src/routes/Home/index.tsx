import React from 'react';
import './index.scss';

const Home: React.FC<{ path: string }> = ({ path }) => {
    return (
        <div className='cashier-v2-home-style'>
            <div> Welcome to Cashier Version 2 from {path} Page 💰</div>
        </div>
    );
};

export default Home;
