import classNames from 'classnames';
import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { isMobile, routes } from '@deriv/shared';
import { HintBox, Icon, Loading, Modal, Tabs, Text } from '@deriv/components';
import ServerTime from 'Utils/server-time';
import { waitWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import { localize, Localize, setLanguage } from './i18next';
import BuySell from './buy-sell/buy-sell.jsx';
import MyAds from './my-ads/my-ads.jsx';
import Orders from './orders/orders.jsx';
import NicknameForm from './nickname/nickname-form.jsx';
import Download from './verification/download.jsx';
import Verification from './verification/verification.jsx';
import MyProfile from './my-profile';
import './app.scss';

const allowed_currency = 'USD';

const TemporaryBarredMessage = observer(() => {
    const { general_store } = useStores();

    return (
        <div className='p2p-cashier__barred-user'>
            <HintBox
                icon='IcAlertWarning'
                message={
                    <Text size='xxxs' color='prominent' line_height='xs'>
                        <Localize
                            i18n_default_text="You've been temporarily barred from using our services due to multiple cancellation attempts. Try again after {{date_time}} GMT."
                            values={{ date_time: general_store.blocked_until_date_time }}
                        />
                    </Text>
                }
                is_warn
            />
        </div>
    );
});

TemporaryBarredMessage.displayName = 'TemporaryBarredMessage';

const P2pWrapper = ({ className, children }) => (
    <main className={classNames('p2p-cashier', className)}>{children}</main>
);

const App = observer(props => {
    const { general_store, order_store } = useStores();
    const {
        className,
        history,
        is_mobile,
        lang,
        order_id,
        server_time,
        should_show_verification,
        websocket_api,
    } = props;
    general_store.setAppProps(props);
    general_store.setWebsocketInit(websocket_api, general_store.client.local_currency_config.decimal_places);
    order_store.setOrderId(order_id);

    React.useEffect(() => {
        // Redirect back to /p2p, this was implemented for the mobile team. Do not remove.
        if (/\/verification$/.test(history?.location.pathname)) {
            localStorage.setItem('is_verifying_p2p', true);
            history.push(routes.cashier_p2p);
        }

        setLanguage(lang);
        ServerTime.init(server_time);

        // force safari refresh on back/forward
        window.onpageshow = function (event) {
            if (event.persisted) {
                window.location.reload();
            }
        };

        waitWS('authorize').then(() => {
            general_store.onMount();

            if (localStorage.getItem('is_verifying_p2p')) {
                localStorage.removeItem('is_verifying_p2p');
                general_store.setActiveIndex(general_store.path.my_ads);
            }
        });

        return () => general_store.onUnmount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (order_id) {
            general_store.redirectTo('orders');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order_id]);

    // TODO: remove allowed_currency check once we publish this to everyone
    if (general_store.client.is_virtual || general_store.client.currency !== allowed_currency) {
        return (
            <h1 className='p2p-not-allowed'>
                {localize('This feature is only available for real-money USD accounts right now.')}
            </h1>
        );
    }

    if (general_store.is_blocked) {
        return (
            <div className='p2p-cashier__blocked'>
                <Icon icon='IcCashierDp2pBlocked' size={128} />
                <Text className='p2p-cashier__blocked--text' color='prominent' line_height='m' size='s' weight='bold'>
                    <Localize i18n_default_text='Your DP2P cashier is blocked' />
                </Text>
                <Text align='center' color='prominent' line_height='m' size='xs'>
                    <Localize i18n_default_text='Please use live chat to contact our Customer Support team for help.' />
                </Text>
            </div>
        );
    }

    const wrapper_props = { className };

    if (general_store.show_popup) {
        return (
            <P2pWrapper {...wrapper_props}>
                {isMobile() ? (
                    <div className='p2p-nickname__dialog'>
                        <NicknameForm
                            handleClose={general_store.onNicknamePopupClose}
                            handleConfirm={general_store.toggleNicknamePopup}
                            is_mobile
                        />
                    </div>
                ) : (
                    <Modal is_open={general_store.show_popup} className='p2p-nickname__dialog'>
                        <NicknameForm
                            handleClose={general_store.onNicknamePopupClose}
                            handleConfirm={general_store.toggleNicknamePopup}
                        />
                    </Modal>
                )}
            </P2pWrapper>
        );
    }

    if (should_show_verification) {
        if (general_store.is_advertiser) {
            return (
                <P2pWrapper {...wrapper_props}>
                    <Download />
                </P2pWrapper>
            );
        }

        return (
            <P2pWrapper {...wrapper_props}>
                <div
                    className={classNames('p2p-cashier__verification', {
                        'p2p-cashier__verification--mobile': is_mobile,
                    })}
                >
                    <Verification />
                </div>
            </P2pWrapper>
        );
    }

    return (
        <React.Fragment>
            {general_store.is_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <P2pWrapper {...wrapper_props}>
                    <Tabs
                        onTabItemClick={general_store.handleTabClick}
                        active_index={general_store.active_index}
                        className='p2p-cashier__tabs'
                        top
                        header_fit_content={!isMobile()}
                        is_100vw={isMobile()}
                    >
                        <div label={localize('Buy / Sell')}>
                            {general_store.is_barred && <TemporaryBarredMessage />}
                            <BuySell />
                        </div>
                        <div count={general_store.notification_count} label={localize('Orders')}>
                            <Orders
                                navigate={general_store.redirectTo}
                                params={general_store.parameters}
                                chat_info={general_store.chat_info}
                            />
                        </div>
                        <div label={localize('My ads')}>
                            {general_store.is_barred && <TemporaryBarredMessage />}
                            <MyAds />
                        </div>
                        {general_store.is_advertiser && (
                            <div label={localize('My profile')}>
                                <MyProfile />
                            </div>
                        )}
                    </Tabs>
                </P2pWrapper>
            )}
        </React.Fragment>
    );
});

App.displayName = 'App';
App.propTypes = {
    client: PropTypes.shape({
        currency: PropTypes.string.isRequired,
        custom_strings: PropTypes.shape({
            email_domain: PropTypes.string,
        }),
        is_virtual: PropTypes.bool.isRequired,
        local_currency_config: PropTypes.shape({
            currency: PropTypes.string.isRequired,
            decimal_places: PropTypes.number,
        }).isRequired,
        loginid: PropTypes.string.isRequired,
        residence: PropTypes.string.isRequired,
    }),
    lang: PropTypes.string,
    modal_root_id: PropTypes.string.isRequired,
    order_id: PropTypes.string,
    setNotificationCount: PropTypes.func,
    websocket_api: PropTypes.object.isRequired,
};

export default App;
