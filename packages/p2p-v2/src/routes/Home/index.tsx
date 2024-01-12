import React from 'react';
import { useActiveAccount } from '@deriv/api';
import './index.scss';

const Home: React.FC<{ path: string }> = ({ path }) => {
    const { data: activeAccountData, isLoading } = useActiveAccount();

    // NOTE: Replace this with Loading component
    if (isLoading || !activeAccountData) return <h1>Loading...</h1>;

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD') return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <div className='p2p-v2-home-style'>
            <div> Welcome to P2P Version 2 from {path} Page ;) </div>
        </div>
    );
};

export default Home;
