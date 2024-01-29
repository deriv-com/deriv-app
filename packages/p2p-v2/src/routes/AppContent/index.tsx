import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveAccount } from '@deriv/api';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { Tab, Tabs } from '@deriv-com/ui/dist/components/Tabs';
import { MobileCloseHeader } from '../../components';
import { useDevice } from '../../hooks';
import './index.scss';

export const routesConfiguration = [
    { Component: <div> Buy Sell Page </div>, path: 'buy-sell', title: 'Buy / Sell' },
    { Component: <div> Orders Page </div>, path: 'orders', title: 'Orders' },
    { Component: <div> My Ads Page </div>, path: 'my-ads', title: 'My Ads' },
    { Component: <div> My Profile Page </div>, path: 'my-profile', title: 'My Profile' },
];
const AppContent = () => {
    const history = useHistory();
    const { data: activeAccountData, isLoading } = useActiveAccount();
    const { isMobile } = useDevice();
    if (isLoading || !activeAccountData) return <Loader color='#85acb0' />;

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD') return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <>
            {isMobile && <MobileCloseHeader />}
            <div className='p2p-v2-tab__wrapper'>
                <Tabs
                    className='p2p-v2-tab__items-wrapper'
                    onChange={index => {
                        history.push(`/cashier/p2p-v2/${routesConfiguration[index].path}`);
                    }}
                    variant='secondary'
                    wrapperClassName='p2p-v2-tab__wrapper'
                >
                    {routesConfiguration.map(({ Component, path, title }) => {
                        return (
                            <Tab key={path} title={title}>
                                {Component}
                            </Tab>
                        );
                    })}
                </Tabs>
            </div>
        </>
    );
};

export default AppContent;
