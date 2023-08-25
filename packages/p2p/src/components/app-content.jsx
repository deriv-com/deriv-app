import React from 'react';
import { isAction, reaction } from 'mobx';
import { useHistory } from 'react-router-dom';
import { useStores } from 'Stores';
import { isMobile } from '@deriv/shared';
import { Loading, Tabs } from '@deriv/components';
import { useStore, observer } from '@deriv/stores';
import classNames from 'classnames';
import { localize } from './i18next';
import NicknameForm from './nickname-form';
import TemporarilyBarredHint from './temporarily-barred-hint';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useP2PNotificationCount } from '@deriv/hooks';

const AppContent = ({ order_id }) => {
    const { buy_sell_store, general_store } = useStores();
    const { showModal, hideModal } = useModalManagerContext();
    const {
        notifications: { setP2POrderProps },
    } = useStore();
    const notification_count = useP2PNotificationCount();
    const history = useHistory();

    React.useEffect(() => {
        return reaction(
            () => setP2POrderProps,
            () => {
                if (isAction(setP2POrderProps)) {
                    setP2POrderProps({
                        order_id,
                        setP2POrderTab: general_store.setP2POrderTab,
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

    if (general_store.should_show_popup) {
        return <NicknameForm />;
    }

    // return empty or else the tabs will be shown above when displaying the advertiser page
    if (
        (buy_sell_store?.show_advertiser_page && !buy_sell_store.should_show_verification) ||
        general_store.should_show_dp2p_blocked
    ) {
        return <></>;
    }

    return (
        <Tabs
            active_index={general_store.active_index}
            className={classNames({ 'p2p-cashier__tabs': general_store.active_index === 0 && isMobile() })}
            header_fit_content={!isMobile()}
            is_100vw={isMobile()}
            is_scrollable
            is_overflow_hidden
            onTabItemClick={active_tab_index => {
                general_store.handleTabClick(active_tab_index);
                history.push({
                    pathname: general_store.active_tab_route,
                });
            }}
            top
        >
            <div label={localize('Buy / Sell')}>
                <TemporarilyBarredHint />
            </div>
            <div data-count={notification_count} label={localize('Orders')} />
            <div label={localize('My ads')}>
                <TemporarilyBarredHint />
            </div>
            {general_store.is_advertiser && <div label={localize('My profile')} data-testid='my_profile' />}
        </Tabs>
    );
};

export default observer(AppContent);
