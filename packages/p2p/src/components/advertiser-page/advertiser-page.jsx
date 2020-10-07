import React from 'react';
import { Button, Icon, Loading, Modal, Popover, Table, Tabs, ThemedScrollbars } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { generateHexColourFromNickname, getShortNickname } from 'Utils/string';
import Dp2pContext from 'Components/context/dp2p-context';
import { InfiniteLoaderList } from 'Components/table/infinite-loader-list.jsx';
import { useStores } from 'Stores';
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

const AdvertiserPage = observer(({ navigate, selected_advert, showVerification }) => {
    const { is_advertiser, nickname } = React.useContext(Dp2pContext);
    const { advertiser_details, account_currency } = selected_advert;
    const Form = nickname ? BuySellForm : NicknameForm;
    const { advertiser_page_store } = useStores();

    const {
        basic_verification,
        buy_completion_rate,
        buy_orders_count,
        full_verification,
        release_time_avg,
        sell_orders_count,
        total_completion_rate,
        total_orders_count,
    } = advertiser_page_store.advertiser_info;

    const modal_title =
        advertiser_page_store.counterparty_type === buy_sell.BUY
            ? localize('Buy {{ currency }}', { currency: account_currency })
            : localize('Sell {{ currency }}', { currency: account_currency });

    const onConfirmClick = order_info => {
        const nav = { location: 'buy_sell' };
        navigate('orders', { order_info, nav });
    };
    const short_name = getShortNickname(advertiser_details.name);
    const showAdPopup = advert => {
        if (!is_advertiser) {
            showVerification();
        } else {
            advertiser_page_store.setAd(advert);
            advertiser_page_store.setShowAdPopup(true);
        }
    };

    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';

    const Row = props => <RowComponent {...props} showAdPopup={showAdPopup} />;

    React.useEffect(() => {
        advertiser_page_store.getAdvertiserAdverts(advertiser_details);
        advertiser_page_store.getAdvertiserInfo(advertiser_details);
    }, []);

    React.useEffect(() => {
        advertiser_page_store.getAdvertiserAdverts(advertiser_details);
    }, [advertiser_page_store.active_index]);

    if (advertiser_page_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    return (
        <div className='advertiser-page'>
            <div className='advertiser-page__container'>
                {advertiser_page_store.show_ad_popup && (
                    <Modal
                        className='buy-sell__popup'
                        height={advertiser_page_store.counterparty_type === buy_sell.BUY ? '400px' : '649px'}
                        width='456px'
                        is_open={advertiser_page_store.show_ad_popup}
                        title={modal_title}
                        toggleModal={advertiser_page_store.onCancelClick}
                    >
                        {/* Parent height - Modal.Header height - Modal.Footer height */}
                        <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                            <Modal.Body>
                                <Form
                                    advert={advertiser_page_store.ad}
                                    handleClose={advertiser_page_store.onCancelClick}
                                    handleConfirm={onConfirmClick}
                                    setIsSubmitDisabled={advertiser_page_store.setIsSubmitDisabled}
                                    setErrorMessage={advertiser_page_store.setFormErrorMessage}
                                    setSubmitForm={advertiser_page_store.setSubmitForm}
                                />
                            </Modal.Body>
                        </ThemedScrollbars>
                        <Modal.Footer has_separator>
                            <FormError message={advertiser_page_store.form_error_message} />
                            <Button.Group>
                                <Button secondary type='button' onClick={advertiser_page_store.onCancelClick} large>
                                    {localize('Cancel')}
                                </Button>
                                <Button
                                    is_disabled={advertiser_page_store.is_submit_disabled}
                                    primary
                                    large
                                    onClick={advertiser_page_store.submitForm}
                                >
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
                    <div className='advertiser-page__header-verification'>
                        {basic_verification ? (
                            <div>
                                {localize('ID verified')}
                                <Icon
                                    className='advertiser-page__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        ) : null}
                        {full_verification ? (
                            <div className='advertiser-page__header-verification-status'>
                                {localize('Address verified')}
                                <Icon
                                    className='advertiser-page__header-verification-icon'
                                    icon='IcCashierVerificationBadge'
                                    size={16}
                                />
                            </div>
                        ) : null}
                    </div>
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
                                {release_time_avg
                                    ? localize('{{- avg_release_time_in_minutes}} min', {
                                          avg_release_time_in_minutes,
                                      })
                                    : '-'}
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
                        onTabItemClick={advertiser_page_store.handleTabItemClick}
                        active_index={advertiser_page_store.active_index}
                        className='advertiser-page__adverts-tabs'
                        top
                        header_fit_content
                    >
                        <div label={localize('Buy')} />
                        <div label={localize('Sell')} />
                    </Tabs>
                    <div className='advertiser-page__adverts-table'>
                        {advertiser_page_store.adverts.length ? (
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
                                            autosizer_height={`calc(${advertiser_page_store.height_values.join(
                                                ' - '
                                            )})`}
                                            items={advertiser_page_store.adverts}
                                            item_size={advertiser_page_store.item_height}
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
});

export default AdvertiserPage;
