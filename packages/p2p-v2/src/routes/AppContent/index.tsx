import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveAccount } from '@deriv/api';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { Tab, Tabs } from '@deriv-com/ui/dist/components/Tabs';
import { CloseHeader } from '../../components';
import { MyProfile } from '../../pages';
import './index.scss';
import { useEventListener } from 'usehooks-ts';

const DEFAULT_TAB = 'Buy / Sell';

export const routesConfiguration = [
    { Component: <div> Buy Sell Page </div>, path: 'buy-sell', title: 'Buy / Sell' },
    { Component: <div> Orders Page </div>, path: 'orders', title: 'Orders' },
    { Component: <div> My Ads Page </div>, path: 'my-ads', title: 'My Ads' },
    { Component: <MyProfile />, path: 'my-profile', title: 'My Profile' },
];
const AppContent = () => {
    const history = useHistory();
    const { data: activeAccountData, isLoading } = useActiveAccount();
    const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

    useEventListener('switchTab', event => {
        console.log(event);
        setActiveTab('orders');
        history.push(`/cashier/p2p-v2/${event.detail.tab}`);
    });

    if (isLoading || !activeAccountData) return <Loader color='#85acb0' />;

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD') return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <>
            <CloseHeader />
            <div className='p2p-v2-tab__wrapper'>
                <Tabs
                    activeTab={activeTab}
                    key={activeTab}
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
