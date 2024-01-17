import React from 'react';

const Home: React.FC<{ path: string }> = ({ path }) => {
    return (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                fontSize: '3rem',
                height: '100%',
                justifyContent: 'center',
            }}
        >
            Welcome to Cashier Version 2 from {path} Page 💰
        </div>
    );
};

export default Home;
