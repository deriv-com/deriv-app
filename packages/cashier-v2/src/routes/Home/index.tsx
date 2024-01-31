import React from 'react';

const Home: React.FC<{ path: string }> = ({ path }) => {
    return (
        <div className='flex justify-center items-center text-300'>
            Welcome to Cashier Version 2 from {path} Page 💰
        </div>
    );
};

export default Home;
