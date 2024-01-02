import React from 'react';
import { useHistory } from 'react-router-dom';
import { isAction, reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

import { Loading, Tabs } from '@deriv/components';
import { useIsSystemMaintenance, useP2PNotificationCount } from '@deriv/hooks';
import { isMobile } from '@deriv/shared';
import { useStore } from '@deriv/stores';

import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import TemporarilyBarredHint from 'Components/temporarily-barred-hint';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';
import { getHoursDifference } from 'Utils/date-time';
import { localize } from './i18next';

const INTERVAL_DURATION = 24; // 24 hours

const AppContent = ({ order_id }) => {
    const { buy_sell_store, general_store } = useStores();
    const { showModal, hideModal } = useModalManagerContext();
    let timeout;
    const {
        notifications: { setP2POrderProps },
        client: { loginid },
    } = useStore();
    const notification_count = useP2PNotificationCount();
    const is_system_maintenance = useIsSystemMaintenance();
    const history = useHistory();

    const handleDisclaimerTimeout = time_lapsed => {
        timeout = setTimeout(() => {
            showModal({ key: 'DisclaimerModal', props: { handleDisclaimerTimeout } });
            // Display the disclaimer modal again after 24 hours
        }, (INTERVAL_DURATION - time_lapsed) * 3600000);
    };

    React.useEffect(() => {
        if (
            !general_store.should_show_dp2p_blocked &&
            !is_system_maintenance &&
            !general_store.counterparty_advert_id
        ) {
            const time_lapsed = getHoursDifference(localStorage.getItem(`p2p_${loginid}_disclaimer_shown`));
            if (time_lapsed === undefined || time_lapsed > INTERVAL_DURATION) {
                showModal({ key: 'DisclaimerModal', props: { handleDisclaimerTimeout } });
            } else {
                handleDisclaimerTimeout(time_lapsed);
            }
        }

        return () => {
            clearTimeout(timeout);
        };
    }, []);

    React.useEffect(() => {
        buy_sell_store.setTableType(buy_sell.BUY);
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

    // return empty or else the tabs will be shown above when displaying the advertiser page or when system maintenance is on
    // or when the user is blocked from using DP2P
    if (
        (buy_sell_store?.show_advertiser_page && !buy_sell_store.should_show_verification) ||
        general_store.should_show_dp2p_blocked ||
        is_system_maintenance
    ) {
        return <></>;
    }

    return (
        <Tabs
            active_index={general_store.active_index}
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
            <div label={localize('My profile')} />
        </Tabs>
    );
};

export default observer(AppContent);
