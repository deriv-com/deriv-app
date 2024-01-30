import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveAccount } from '@deriv/api';
import { Loader } from '@deriv-com/ui/dist/components/Loader';
import { Tab, Tabs } from '@deriv-com/ui/dist/components/Tabs';
import { CloseHeader } from '../../components';
import { MyProfile } from '../../pages';
import './index.scss';

const DEFAULT_TAB = 'buy-sell';

export const routesConfiguration = [
    { Component: <div> Buy Sell Page </div>, path: 'buy-sell', title: 'Buy / Sell' },
    { Component: <div> Orders Page </div>, path: 'orders', title: 'Orders' },
    { Component: <div> My Ads Page </div>, path: 'my-ads', title: 'My Ads' },
    { Component: <MyProfile />, path: 'my-profile', title: 'My Profile' },
];
const AppContent = () => {
    const history = useHistory();
    const { data: activeAccountData, isLoading } = useActiveAccount();

    const initialTab = useMemo(() => {
        const pathname = new URL(window.location.href).pathname;
        const segments = pathname.split('/');

        return routesConfiguration.find(route => route.path === segments[segments.length - 1])?.title || DEFAULT_TAB;
    }, [window.location.href]);

    if (isLoading || !activeAccountData) return <Loader color='#85acb0' />;

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD') return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <>
            <CloseHeader />
            <div className='p2p-v2-tab__wrapper'>
                <Tabs
                    activeTab={initialTab}
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
