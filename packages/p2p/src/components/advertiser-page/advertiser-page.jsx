import React from 'react';
import { Button, Icon, Loading, Modal, Popover, Table, Tabs, ThemedScrollbars } from '@deriv/components';
import { useIsMounted } from '@deriv/shared';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import { height_constants } from 'Utils/height_constants';
import Dp2pContext from 'Components/context/dp2p-context';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { requestWS } from 'Utils/websocket';
import Empty from 'Components/empty/empty.jsx';
import NicknameForm from '../nickname/nickname-form.jsx';
import { buy_sell } from '../../constants/buy-sell';
import BuySellForm from '../buy-sell/buy-sell-form.jsx';
import FormError from '../form/error.jsx';
import { localize } from '../i18next';
import './advertiser-page.scss';

const RowComponent = React.memo(({ advert, showAdPopup, style }) => {
    const { advertiser_id } = React.useContext(Dp2pContext);
    const {
        account_currency,
        advertiser_details,
        counterparty_type,
        local_currency,
        max_order_amount_limit_display,
        min_order_amount_limit_display,
        price_display,
    } = advert;

    const is_buy_advert = counterparty_type === buy_sell.BUY;
    const is_my_advert = advertiser_details.id === advertiser_id;

    return (
        <div style={style}>
            <Table.Row className='advertiser-page__adverts-table_row'>
                <Table.Cell>
                    {min_order_amount_limit_display}&ndash;{max_order_amount_limit_display} {account_currency}
                </Table.Cell>
                <Table.Cell className='advertiser-page__adverts-price'>
                    {price_display} {local_currency}
                </Table.Cell>
                {is_my_advert ? (
                    <Table.Cell />
                ) : (
                    <Table.Cell className='advertiser-page__adverts-button'>
                        <Button primary small onClick={() => showAdPopup(advert)}>
                            {is_buy_advert ? localize('Buy') : localize('Sell')} {account_currency}
                        </Button>
                    </Table.Cell>
                )}
            </Table.Row>
        </div>
    );
});

RowComponent.displayName = 'RowComponent';

const AdvertiserPage = ({ navigate, selected_advert, showVerification }) => {
    const { is_advertiser, nickname } = React.useContext(Dp2pContext);
    const { advertiser_details, account_currency } = selected_advert;
    const [active_index, setActiveIndex] = React.useState(0);
    const [ad, setAd] = React.useState(null);
    const [adverts, setAdverts] = React.useState([]);
    const [counterparty_type, setCounterpartyType] = React.useState(buy_sell.BUY);
    const [error_message, setErrorMessage] = React.useState('');
    const [form_error_message, setFormErrorMessage] = React.useState('');

    const height_values = [
        height_constants.screen,
        height_constants.advertiser_page_content,
        height_constants.core_header,
        height_constants.core_footer,
        height_constants.filters,
        height_constants.filters_margin,
        height_constants.page_overlay_header,
        height_constants.page_overlay_content_padding,
        height_constants.table_header,
        height_constants.tabs,
    ];
    const [is_loading, setIsLoading] = React.useState(true);
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(true);
    const isMounted = useIsMounted();
    const item_height = 56;
    const short_name = getShortNickname(advertiser_details.name);
    const [show_ad_popup, setShowAdPopup] = React.useState(false);
    const [stats, setStats] = React.useState({});
    const submitForm = React.useRef(() => {});
    const {
        buy_completion_rate,
        buy_orders_count,
        release_time_avg,
        sell_orders_count,
        total_completion_rate,
        total_orders_count,
    } = stats;
    const Form = nickname ? BuySellForm : NicknameForm;
    const modal_title =
        counterparty_type === buy_sell.BUY
            ? localize('Buy {{ currency }}', { currency: account_currency })
            : localize('Sell {{ currency }}', { currency: account_currency });

    React.useEffect(() => {
        if (isMounted()) {
            getAdvertiserAdverts();
            getAdvertiserStats();
        }
    }, []);

    React.useEffect(() => {
        getAdvertiserAdverts();
    }, [active_index]);

    const getAdvertiserAdverts = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_advert_list: 1,
                counterparty_type,
                advertiser_id: advertiser_details.id,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { list } = response.p2p_advert_list;
                        setAdverts(list);
                    } else {
                        setErrorMessage(response.error);
                    }
                }
                resolve();
            });
        });
    };

    const getAdvertiserStats = () => {
        return new Promise(resolve => {
            requestWS({
                p2p_advertiser_stats: 1,
                id: advertiser_details.id,
            }).then(response => {
                if (isMounted()) {
                    if (!response.error) {
                        const { p2p_advertiser_stats } = response;
                        setStats(p2p_advertiser_stats);
                    } else {
                        setErrorMessage(response.error);
                    }
                    setIsLoading(false);
                }
                resolve();
            });
        });
    };

    const handleTabItemClick = idx => {
        if (isMounted()) {
            setActiveIndex(idx);
            if (idx === 0) {
                setCounterpartyType(buy_sell.BUY);
            } else {
                setCounterpartyType(buy_sell.SELL);
            }
        }
    };

    const onCancelClick = () => {
        setShowAdPopup(false);
    };

    const onConfirmClick = order_info => {
        const nav = { location: 'buy_sell' };
        navigate('orders', { order_info, nav });
    };

    const Row = props => <RowComponent {...props} showAdPopup={showAdPopup} />;

    const setSubmitForm = submitFormFn => (submitForm.current = submitFormFn);

    const showAdPopup = advert => {
        if (!is_advertiser) {
            showVerification();
        } else {
            setAd(advert);
            setShowAdPopup(true);
        }
    };

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (error_message) {
        return <div className='advertiser-page__error'>{error_message}</div>;
    }

    return (
        <div className='advertiser-page'>
            <div className='advertiser-page__container'>
                {show_ad_popup && (
                    <Modal
                        className='buy-sell__popup'
                        height={counterparty_type === buy_sell.BUY ? '400px' : '649px'}
                        width='456px'
                        is_open={show_ad_popup}
                        title={modal_title}
                        toggleModal={onCancelClick}
                    >
                        {/* Parent height - Modal.Header height - Modal.Footer height */}
                        <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                            <Modal.Body>
                                <Form
                                    advert={ad}
                                    handleClose={onCancelClick}
                                    handleConfirm={onConfirmClick}
                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                    setErrorMessage={setFormErrorMessage}
                                    setSubmitForm={setSubmitForm}
                                />
                            </Modal.Body>
                        </ThemedScrollbars>
                        <Modal.Footer has_separator>
                            <FormError message={form_error_message} />
                            <Button.Group>
                                <Button secondary type='button' onClick={onCancelClick} large>
                                    {localize('Cancel')}
                                </Button>
                                <Button is_disabled={is_submit_disabled} primary large onClick={submitForm.current}>
                                    {localize('Confirm')}
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal>
                )}
                <div className='advertiser-page__header'>
                    <div className='advertiser-page__header-details'>
                        <div
                            className='advertiser-page__header-avatar'
                            style={{ backgroundColor: generateHexColourFromNickname(advertiser_details.name) }}
                        >
                            {short_name}
                        </div>
                        <div className='advertiser-page__header-name'>{advertiser_details.name}</div>
                    </div>
                    {/* TODO: add check for id and address verified */}
                    {/* <div className='advertiser-page__header-verification'>
                        <div className='advertiser-page__header-verification-id'>
                            {localize('ID Verified')}
                            <Icon icon='IcCashierVerificationBadge' size={14} />
                        </div>
                        <div className='advertiser-page__header-verification-address'>
                            {localize('Address verified')}
                            <Icon icon='IcCashierVerificationBadge' size={14} />
                        </div>
                    </div> */}
                </div>
                <Table>
                    <Table.Row className='advertiser-page__stats'>
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <div className='advertiser-page__stats-cell-header'>{localize('Total orders')}</div>
                            <div className='advertiser-page__stats-cell-info'>{total_orders_count || '-'}</div>
                        </Table.Cell>
                        <div className='advertiser-page__stats-cell-separator' />
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <div className='advertiser-page__stats-cell-header'>{localize('Buy')}</div>
                            <div className='advertiser-page__stats-cell-info'>{buy_orders_count || '-'}</div>
                        </Table.Cell>
                        <div className='advertiser-page__stats-cell-separator' />
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <div className='advertiser-page__stats-cell-header'>{localize('Sell')}</div>
                            <div className='advertiser-page__stats-cell-info'>{sell_orders_count || '-'}</div>
                        </Table.Cell>
                        <div className='advertiser-page__stats-cell-separator' />
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <div className='advertiser-page__stats-cell-header'>{localize('Completion')}</div>
                            <div className='advertiser-page__stats-cell-completion'>
                                <div className='advertiser-page__stats-cell-info'>
                                    {total_completion_rate ? `${total_completion_rate}%` : '-'}
                                </div>
                                <div className='advertiser-page__stats-cell-info_buy'>
                                    {localize('(Buy {{ buy_completion_rate }}%)', {
                                        buy_completion_rate: buy_completion_rate || 0,
                                    })}
                                </div>
                            </div>
                        </Table.Cell>
                        <div className='advertiser-page__stats-cell-separator' />
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <div className='advertiser-page__stats-cell-header'>{localize('Avg. release')}</div>
                            <div className='advertiser-page__stats-cell-info'>
                                {release_time_avg ? localize('{{release_time_avg}} min', { release_time_avg }) : '-'}
                            </div>
                        </Table.Cell>
                        <Popover
                            className='advertiser-page__popover-icon'
                            alignment='top'
                            message={localize(
                                "These fields are based on the last 30 days' activity: Buy, Sell, Completion, and Avg. release."
                            )}
                        >
                            <Icon icon='IcInfoOutline' size={16} />
                        </Popover>
                    </Table.Row>
                </Table>
                <div className='advertiser-page__adverts'>
                    <Tabs
                        onTabItemClick={handleTabItemClick}
                        active_index={active_index}
                        className='advertiser-page__adverts-tabs'
                        top
                        header_fit_content
                    >
                        <div label={localize('Buy')} />
                        <div label={localize('Sell')} />
                    </Tabs>
                    <div className='advertiser-page__adverts-table'>
                        {adverts.length ? (
                            <Table>
                                <Table.Header>
                                    <Table.Row className='advertiser-page__adverts-table_row'>
                                        <Table.Head>{localize('Limits')}</Table.Head>
                                        <Table.Head>
                                            {localize('Rate (1 {{account_currency}})', { account_currency })}
                                        </Table.Head>
                                        <Table.Head>{''}</Table.Head>
                                    </Table.Row>
                                </Table.Header>
                                <ThemedScrollbars className='advertiser-page__adverts-scrollbar'>
                                    <Table.Body>
                                        <InfiniteLoaderList
                                            autosizer_height={`calc(${height_values.join(' - ')})`}
                                            items={adverts}
                                            item_size={item_height}
                                            RenderComponent={Row}
                                        />
                                    </Table.Body>
                                </ThemedScrollbars>
                            </Table>
                        ) : (
                            <Empty icon='IcCashierNoAds' title={localize('No ads')} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvertiserPage;
