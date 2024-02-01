import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';
import { useActiveAccount } from '@deriv/api';
import { Loader, Tab, Tabs } from '@deriv-com/ui';
import { CloseHeader } from '../../components';
import { MyAds, MyProfile } from '../../pages';
import './index.scss';

const DEFAULT_TAB = 'buy-sell';

export const routesConfiguration = [
    { Component: <div> Buy sell page </div>, path: 'buy-sell', title: 'Buy / Sell' },
    { Component: <div> Orders Page </div>, path: 'orders', title: 'Orders' },
    {
        Component: (
            <div>
                <MyAds />{' '}
            </div>
        ),
        path: 'my-ads',
        title: 'My Ads',
    },
    { Component: <MyProfile />, path: 'my-profile', title: 'My Profile' },
];

const pathToTitleMapper = Object.fromEntries(routesConfiguration.map(route => [route.path, route.title]));

const getCurrentRoute = () => {
    const segments = new URL(window.location.href).pathname.split('/');
    const endPath = segments.pop();
    return endPath;
};

const AppContent = () => {
    const history = useHistory();
    const { data: activeAccountData, isLoading } = useActiveAccount();
    const [activeTab, setActiveTab] = useState(() => pathToTitleMapper[getCurrentRoute() || DEFAULT_TAB]);

    useEventListener('switchTab', event => {
        setActiveTab(pathToTitleMapper[event.detail.tab]);
        history.push(`/cashier/p2p-v2/${event.detail.tab}`);
    });

    useEventListener('popstate', () => {
        const endPath = getCurrentRoute();
        if (endPath) setActiveTab(pathToTitleMapper[endPath]);
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
                    className='p2p-v2-tab__items-wrapper'
                    onChange={index => {
                        setActiveTab(routesConfiguration[index].title);
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
