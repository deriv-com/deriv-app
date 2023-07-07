import * as React from 'react';
import { isMobile } from '@deriv/shared';
import { Loading, MobileWrapper, Tabs } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { isAction, reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import AdvertiserPage from 'Pages/advertiser-page/advertiser-page.jsx';
import BuySell from 'Pages/buy-sell/buy-sell.jsx';
import Dp2pBlocked from 'Components/dp2p-blocked';
import { localize } from './i18next';
import MyAds from 'Pages/my-ads';
import MyProfile from 'Pages/my-profile';
import NicknameForm from './nickname-form';
import Orders from 'Pages/orders/orders.jsx';
import TemporarilyBarredHint from 'Components/temporarily-barred-hint';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useP2PNotificationCount } from '@deriv/hooks';

const AppContent = ({ order_id }) => {
    const { buy_sell_store, general_store } = useStores();
    const { showModal, hideModal } = useModalManagerContext();
    const {
        notifications: { setP2POrderProps },
    } = useStore();
    const notification_count = useP2PNotificationCount();

    React.useEffect(() => {
        return reaction(
            () => setP2POrderProps,
            () => {
                if (isAction(setP2POrderProps)) {
                    setP2POrderProps({
                        order_id,
                        redirectToOrderDetails: general_store.redirectToOrderDetails,
                        setIsRatingModalOpen: is_open => {
                            if (is_open) {
                                showModal({ key: 'RatingModal' });
                            } else {
                                hideModal();
                            }
                        },
                    });
                }
            }
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (general_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (general_store.should_show_dp2p_blocked) {
        return <Dp2pBlocked />;
    }

    if (general_store.should_show_popup) {
        return (
            <MobileWrapper>
                <NicknameForm />
            </MobileWrapper>
        );
    }

    if (buy_sell_store?.show_advertiser_page && !buy_sell_store.should_show_verification) {
        return <AdvertiserPage />;
    }

    return (
        <Tabs
            active_index={general_store.active_index}
            className='p2p__tabs'
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
            <div data-count={notification_count} label={localize('Orders')}>
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
