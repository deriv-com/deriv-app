import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { CloseHeader } from '@/components';
import { BUY_SELL_URL } from '@/constants';
import { AdvertiserInfoStateProvider } from '@/providers/AdvertiserInfoStateProvider';
import { p2p, useActiveAccount, useAuthorize } from '@deriv/api-v2';
import { Loader, Tab, Tabs } from '@deriv-com/ui';
import Router from '../Router';
import { routes } from '../routes-config';
import './index.scss';

const tabRoutesConfiguration = routes.filter(route => route.name !== 'Advertiser');

const AppContent = () => {
    const history = useHistory();
    const location = useLocation();
    const { data: activeAccountData, isLoading: isLoadingActiveAccount } = useActiveAccount();
    const { isSuccess } = useAuthorize();

    const getActiveTab = (pathname: string) => {
        const match = routes.find(route => pathname.startsWith(route.path));
        return match ? match.name : BUY_SELL_URL;
    };

    const [activeTab, setActiveTab] = useState(() => getActiveTab(location.pathname));
    const [hasCreatedAdvertiser, setHasCreatedAdvertiser] = useState(false);
    const { subscribe: subscribeP2PSettings } = p2p.settings.useGetSettings();
    const { error, isIdle, isLoading, isSubscribed, subscribe: subscribeAdvertiserInfo } = p2p.advertiser.useGetInfo();

    useEffect(() => {
        if (activeAccountData) {
            subscribeP2PSettings();
        }
    }, [activeAccountData, subscribeP2PSettings]);

    useEffect(() => {
        if (isSuccess) {
            subscribeAdvertiserInfo();
        }
    }, [isSuccess, subscribeAdvertiserInfo]);

    // Need this to subscribe to advertiser info after user has created an advertiser.
    // setHasCreatedAdvertiser is triggered inside of NicknameModal.
    useEffect(() => {
        if (isSuccess && hasCreatedAdvertiser) {
            subscribeAdvertiserInfo();
        }
    }, [hasCreatedAdvertiser, isSuccess, subscribeAdvertiserInfo]);

    useEffect(() => {
        setActiveTab(getActiveTab(location.pathname));
    }, [location]);

    if (isLoadingActiveAccount || !activeAccountData) return <Loader color='#85acb0' />;

    // NOTE: Replace this with P2PBlocked component later and a custom hook useIsP2PEnabled, P2P is only available for USD accounts
    if (activeAccountData?.currency !== 'USD') return <h1>P2P is only available for USD accounts.</h1>;

    return (
        <AdvertiserInfoStateProvider
            value={{
                error,
                isIdle,
                isLoading,
                isSubscribed,
                setHasCreatedAdvertiser,
            }}
        >
            <CloseHeader />
            <div className='p2p-v2-app-content'>
                <Tabs
                    activeTab={activeTab}
                    className='p2p-v2-app-content__tabs'
                    onChange={index => {
                        setActiveTab(tabRoutesConfiguration[index].name);
                        history.push(tabRoutesConfiguration[index].path);
                    }}
                    variant='secondary'
                >
                    {tabRoutesConfiguration.map(route => (
                        <Tab key={route.name} title={route.name} />
                    ))}
                </Tabs>
                <Router />
            </div>
        </AdvertiserInfoStateProvider>
    );
};

export default AppContent;
