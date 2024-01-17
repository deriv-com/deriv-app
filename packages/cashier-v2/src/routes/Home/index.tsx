import React from 'react';

const Home: React.FC<{ path: string }> = ({ path }) => {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '3rem',
                height: '100%',
            }}
        >
            Welcome to Cashier Version 2 from {path} Page 💰
        </div>
    );
};

export default Home;
