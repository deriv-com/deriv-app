import React from 'react';
import { useActiveAccount } from '@deriv/api';
import { MobileCloseHeader } from '../../components';
import { useDevice } from '../../hooks';
import './index.scss';
import { MyProfileCounterparties } from '../../pages/my-profile/screens';

const Home: React.FC<{ path: string }> = ({ path }) => {
    const { data: activeAccountData, isLoading } = useActiveAccount();

    const { isMobile } = useDevice();

    // NOTE: Replace this with Loading component
    if (isLoading || !activeAccountData) return <h1>Loading...</h1>;

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD') return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <>
            {isMobile && <MobileCloseHeader />}
            <div className='p2p-v2-home-style' style={{ display: 'flex', flexDirection: 'column' }}>
                <div> Welcome to P2P Version 2 from {path} Page ;) </div>
                {/* <div style={{ height: '50%' }} /> */}
                <MyProfileCounterparties />
            </div>
        </>
    );
};

export default Home;
