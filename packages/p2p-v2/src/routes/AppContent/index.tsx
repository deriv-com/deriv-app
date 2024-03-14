import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useEventListener } from 'usehooks-ts';
import { CloseHeader } from '@/components';
import { Advertiser, BuySell, MyAds, MyProfile, Orders } from '@/pages';
import { getCurrentRoute } from '@/utils';
import { p2p, useActiveAccount } from '@deriv/api-v2';
import { Loader, Tab, Tabs } from '@deriv-com/ui';
import './index.scss';

const DEFAULT_TAB = 'buy-sell';

export const routesConfiguration = [
    { Component: <BuySell />, path: 'buy-sell', title: 'Buy / Sell' },
    { Component: <Orders />, path: 'orders', title: 'Orders' },
    {
        Component: <MyAds />,
        path: 'my-ads',
        title: 'My Ads',
    },
    { Component: <MyProfile />, path: 'my-profile', title: 'My Profile' },
    { Component: <Advertiser />, path: 'advertiser', title: 'Advertiser' },
];

const tabRoutesConfiguration = routesConfiguration.filter(route => route.path !== 'advertiser');

const pathToTitleMapper = Object.fromEntries(tabRoutesConfiguration.map(route => [route.path, route.title]));

const AppContent = () => {
    const history = useHistory();
    const { data: activeAccountData, isLoading } = useActiveAccount();
    const [activeTab, setActiveTab] = useState(() => pathToTitleMapper[getCurrentRoute() || DEFAULT_TAB]);
    const { subscribe } = p2p.settings.useGetSettings();

    useEffect(() => {
        if (activeAccountData) subscribe();
    }, [activeAccountData, subscribe]);

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
            <div className='p2p-v2-tab__wrapper overflow-hidden'>
                {getCurrentRoute()?.includes('advertiser') ? (
                    <Advertiser />
                ) : (
                    <Tabs
                        activeTab={activeTab}
                        className='p2p-v2-tab__items-wrapper'
                        onChange={index => {
                            setActiveTab(tabRoutesConfiguration[index].title);
                            history.push(`/cashier/p2p-v2/${tabRoutesConfiguration[index].path}`);
                        }}
                        variant='secondary'
                        wrapperClassName='p2p-v2-tab__wrapper'
                    >
                        {tabRoutesConfiguration.map(({ Component, path, title }) => {
                            return (
                                <Tab key={path} title={title}>
                                    {Component}
                                </Tab>
                            );
                        })}
                    </Tabs>
                )}
            </div>
        </>
    );
};

export default AppContent;
