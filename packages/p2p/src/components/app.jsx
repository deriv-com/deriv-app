import classNames from 'classnames';
import React from 'react';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { getPropertyValue } from '@deriv/shared';
import { Tabs, Modal } from '@deriv/components';
import { Dp2pProvider } from 'Components/context/dp2p-context';
import ServerTime from 'Utils/server-time';
import { waitWS } from 'Utils/websocket';
import { useStores } from 'Stores';
import { localize, setLanguage } from './i18next';
import BuySell from './buy-sell/buy-sell.jsx';
import MyAds from './my-ads/my-ads.jsx';
import Orders from './orders/orders.jsx';
import NicknameForm from './nickname/nickname-form.jsx';
import Download from './verification/download.jsx';
import Verification from './verification/verification.jsx';
import MyProfile from './my-profile/my-profile.jsx';
import './app.scss';

const allowed_currency = 'USD';
const App = observer(props => {
    const { general_store } = useStores();
    const {
        className,
        custom_strings,
        is_mobile,
        lang,
        loginid,
        modal_root_id,
        order_id,
        poi_url,
        server_time,
        setOrderId,
        should_show_verification,
        websocket_api,
    } = props;
    general_store.setAppProps(props);
    general_store.setWebsocketInit(websocket_api, general_store.client.local_currency_config.decimal_places);

    React.useEffect(() => {
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
        });

        return () => general_store.onUnmount();
    }, []);

    React.useEffect(() => {
        if (order_id) {
            general_store.redirectTo('orders');
        }
    }, [order_id]);

    // TODO: remove allowed_currency check once we publish this to everyone
    if (general_store.client.is_virtual || general_store.client.currency !== allowed_currency) {
        return (
            <h1 className='p2p-not-allowed'>
                {localize('This feature is only available for real-money USD accounts right now.')}
            </h1>
        );
    }

    return (
        <Dp2pProvider
            value={{
                active_notification_count: general_store.active_notification_count,
                advertiser_id: general_store.advertiser_id,
                changeOrderToggle: order_table_type => general_store.setOrderTableType(order_table_type),
                changeTab: general_store.handleTabClick,
                createAdvertiser: general_store.createAdvertiser,
                currency: general_store.client.currency,
                email_domain: getPropertyValue(custom_strings, 'email_domain') || 'deriv.com',
                getLocalStorageSettingsForLoginId: general_store.getLocalStorageSettingsForLoginId,
                handleNotifications: general_store.handleNotifications,
                inactive_notification_count: general_store.inactive_notification_count,
                is_active_tab: general_store.is_active_tab,
                is_advertiser: general_store.is_advertiser,
                is_listed: general_store.is_listed,
                is_mobile,
                is_restricted: general_store.is_restricted,
                list_item_limit: general_store.list_item_limit,
                local_currency_config: general_store.client.local_currency_config,
                loginid,
                modal_root_id,
                nickname: general_store.nickname,
                nickname_error: general_store.nickname_error,
                order_id,
                order_offset: general_store.order_offset,
                order_table_type: general_store.order_table_type,
                orders: general_store.orders,
                poi_status: general_store.poi_status,
                poi_url,
                resetNicknameErrorState: general_store.resetNicknameErrorState,
                residence: general_store.client.residence,
                setChatInfo: general_store.setChatInfo,
                setIsListed: is_listed => {
                    general_store.setIsListed(is_listed);
                },
                setIsAdvertiser: is_advertiser => {
                    general_store.setIsAdvertiser(is_advertiser);
                },
                setNickname: general_store.setNickname,
                setOrderId,
                setOrders: general_store.setOrders,
                setOrderOffset: order_offset => {
                    general_store.setOrderOffset(order_offset);
                },
                setPoiStatus: general_store.setPoiStatus,
                toggleNicknamePopup: general_store.toggleNicknamePopup,
                updateP2pNotifications: general_store.updateP2pNotifications,
            }}
        >
            <main className={classNames('p2p-cashier', className)}>
                {general_store.show_popup ? (
                    <>
                        {is_mobile ? (
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
                    </>
                ) : (
                    <>
                        {should_show_verification && !general_store.is_advertiser && (
                            <div
                                className={classNames('p2p-cashier__verification', {
                                    'p2p-cashier__verification--mobile': is_mobile,
                                })}
                            >
                                <Verification />
                            </div>
                        )}
                        {should_show_verification && general_store.is_advertiser && <Download />}
                        {!should_show_verification && (
                            <Tabs
                                onTabItemClick={general_store.handleTabClick}
                                active_index={general_store.active_index}
                                className='p2p-cashier'
                                top
                                header_fit_content
                            >
                                <div label={localize('Buy / Sell')}>
                                    <BuySell navigate={general_store.redirectTo} params={general_store.parameters} />
                                </div>
                                <div count={general_store.notification_count} label={localize('Orders')}>
                                    <Orders
                                        navigate={general_store.redirectTo}
                                        params={general_store.parameters}
                                        chat_info={general_store.chat_info}
                                    />
                                </div>
                                <div label={localize('My ads')}>
                                    <MyAds navigate={general_store.redirectTo} params={general_store.parameters} />
                                </div>
                                {general_store.is_advertiser && (
                                    <div label={localize('My profile')}>
                                        <MyProfile
                                            navigate={general_store.redirectTo}
                                            params={general_store.parameters}
                                        />
                                    </div>
                                )}
                            </Tabs>
                        )}
                    </>
                )}
            </main>
        </Dp2pProvider>
    );
});

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
