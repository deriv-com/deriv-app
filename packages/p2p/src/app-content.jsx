import * as React from 'react';
import { isMobile } from '@deriv/shared';
import { Loading, Tabs } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import AdvertiserPage from 'Components/advertiser-page/advertiser-page.jsx';
import BuySell from 'Components/buy-sell/buy-sell.jsx';
import Dp2pBlocked from 'Components/dp2p-blocked';
import { localize } from 'Components/i18next';
import MyAds from 'Components/my-ads/my-ads.jsx';
import MyProfile from 'Components/my-profile';
import NicknameForm from 'Components/nickname-form';
import Orders from 'Components/orders/orders.jsx';
import TemporarilyBarredHint from 'Components/temporarily-barred-hint';
import Verification from 'Components/verification/verification.jsx';

const AppContent = () => {
    const { buy_sell_store, general_store } = useStores();

    if (general_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (general_store.should_show_dp2p_blocked || general_store.is_p2p_blocked_for_pa) {
        return <Dp2pBlocked />;
    }

    if (general_store.should_show_popup) {
        return <NicknameForm />;
    }

    if (general_store.props.should_show_verification) {
        return <Verification should_wrap />;
    }

    if (buy_sell_store?.show_advertiser_page && !buy_sell_store.should_show_verification) {
        return <AdvertiserPage />;
    }

    return (
        <Tabs
            active_index={general_store.active_index}
            className='p2p-cashier__tabs'
            header_fit_content={!isMobile()}
            is_100vw={isMobile()}
            is_scrollable
            is_overflow_hidden
            onTabItemClick={general_store.handleTabClick}
            top
        >
            <div label={localize('Buy / Sell')}>
                <TemporarilyBarredHint />
                <BuySell />
            </div>
            <div count={general_store.notification_count} label={localize('Orders')}>
                <Orders />
            </div>
            <div label={localize('My ads')}>
                <TemporarilyBarredHint />
                <MyAds />
            </div>
            {general_store.is_advertiser && (
                <div label={localize('My profile')} data-testid='my_profile'>
                    <MyProfile />
                </div>
            )}
        </Tabs>
    );
};

export default observer(AppContent);
