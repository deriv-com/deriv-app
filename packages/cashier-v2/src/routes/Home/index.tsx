import React from 'react';
import { Heading } from '@deriv/quill-design';

const Home: React.FC<{ path: string }> = ({ path }) => {
    return (
        <div className='flex justify-center items-center pt-2500'>
            <Heading.H2> Welcome to Cashier Version 2 from {path} Page 💰</Heading.H2>
        </div>
    );
};

export default Home;
