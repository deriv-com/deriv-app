import React from 'react';
import { MyProfileStats } from '../../features/my-profile/screens';
import './index.scss';

const Home: React.FC<{ path: string }> = ({ path }) => {
    return (
        <div className='p2p-v2-home-style'>
            <div> Welcome to P2P Version 2 from {path} Page ;) </div>
            <MyProfileStats />
        </div>
    );
};

export default Home;
