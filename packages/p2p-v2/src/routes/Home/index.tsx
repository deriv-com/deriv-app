import React from 'react';
import { useActiveAccount } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';

const Home: React.FC<{ path: string }> = ({ path }) => {
    const { data: activeAccountData, isLoading } = useActiveAccount();

    if (isLoading || !activeAccountData) return <Loader />;

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD') return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <>
            <div className='p2p-v2-home-style'>
                <div className='flex justify-center px-10 text-red-500 font-bold'>
                    {' '}
                    Welcome to P2P Version 2 from {path} Page ;){' '}
                </div>
            </div>
        </>
    );
};

export default Home;
