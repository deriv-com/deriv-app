import React from 'react';
import {
    Button,
    Icon,
    InfiniteDataList,
    Loading,
    Modal,
    Popover,
    Table,
    Tabs,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PropTypes from 'prop-types';
import { buy_sell } from 'Constants/buy-sell';
import BuySellForm from 'Components/buy-sell/buy-sell-form.jsx';
import Empty from 'Components/empty/empty.jsx';
import FormError from 'Components/form/error.jsx';
import { localize } from 'Components/i18next';
import NicknameForm from 'Components/nickname/nickname-form.jsx';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import AdvertiserPageRow from './advertiser-page-row.jsx';
import './advertiser-page.scss';

const AdvertiserPage = observer(() => {
    const { advertiser_page_store, general_store } = useStores();

    const {
        basic_verification,
        buy_completion_rate,
        buy_orders_count,
        first_name,
        full_verification,
        last_name,
        release_time_avg,
        sell_orders_count,
        total_completion_rate,
        total_orders_count,
    } = advertiser_page_store.advertiser_info;

    React.useEffect(() => {
        advertiser_page_store.onMount();

        return reaction(
            () => advertiser_page_store.active_index,
            () => advertiser_page_store.onTabChange(),
            { fireImmediately: true }
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (advertiser_page_store.is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (advertiser_page_store.error_message) {
        return <div className='advertiser-page__error'>{advertiser_page_store.error_message}</div>;
    }

    const avg_release_time_in_minutes = release_time_avg > 60 ? Math.round(release_time_avg / 60) : '< 1';
    const Form = general_store.nickname ? BuySellForm : NicknameForm;

    const AdvertiserPageRowRenderer = row_props => (
        <AdvertiserPageRow {...row_props} showAdPopup={advertiser_page_store.showAdPopup} />
    );

    return (
        <div className='advertiser-page'>
            <div className='advertiser-page__container'>
                {advertiser_page_store.show_ad_popup && (
                    <Modal
                        className='buy-sell__modal'
                        height={advertiser_page_store.counterparty_type === buy_sell.BUY ? '400px' : '649px'}
                        width='456px'
                        is_open={advertiser_page_store.show_ad_popup}
                        title={advertiser_page_store.modal_title}
                        toggleModal={advertiser_page_store.onCancelClick}
                    >
                        {/* Parent height - Modal.Header height - Modal.Footer height */}
                        <ThemedScrollbars height='calc(100% - 5.8rem - 7.4rem)'>
                            <Modal.Body>
                                <Form
                                    advert={advertiser_page_store.advert}
                                    handleClose={advertiser_page_store.onCancelClick}
                                    handleConfirm={advertiser_page_store.onConfirmClick}
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
                        <UserAvatar
                            nickname={advertiser_page_store.advertiser_details_name}
                            size={32}
                            text_size='xxs'
                        />
                        <div className='advertiser-page__header-name'>
                            <Text color='prominent' line-height='m' size='s' weight='bold'>
                                {advertiser_page_store.advertiser_details_name}
                            </Text>
                            {first_name && last_name && (
                                <div className='advertiser-page__header-real-name'>
                                    <Text color='less-prominent' line_height='xs' size='xs'>
                                        {`${first_name} ${last_name}`}
                                    </Text>
                                </div>
                            )}
                        </div>
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
                                    {localize('(Buy {{- buy_completion_rate }})', {
                                        buy_completion_rate: buy_completion_rate
                                            ? `${buy_completion_rate}%`
                                            : localize('N/A'),
                                    })}
                                </div>
                            </div>
                        </Table.Cell>
                        <div className='advertiser-page__stats-cell-separator' />
                        <Table.Cell className='advertiser-page__stats-cell'>
                            <div className='advertiser-page__stats-cell-header'>{localize('Avg. release time')}</div>
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
                                "These fields are based on the last 30 days' activity: Buy, Sell, Completion, and Avg. release time."
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
                    {advertiser_page_store.is_loading_adverts ? (
                        <div className='advertiser-page__adverts-table'>
                            <Loading is_fullscreen={false} />
                        </div>
                    ) : (
                        <React.Fragment>
                            {advertiser_page_store.adverts.length ? (
                                <Table className='advertiser-page__adverts-table'>
                                    <Table.Header>
                                        <Table.Row className='advertiser-page__adverts-table_row'>
                                            <Table.Head>{localize('Limits')}</Table.Head>
                                            <Table.Head>
                                                {localize('Rate (1 {{currency}})', {
                                                    currency: general_store.client.currency,
                                                })}
                                            </Table.Head>
                                            <Table.Head>{''}</Table.Head>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body className='advertiser-page__adverts-table-body'>
                                        <InfiniteDataList
                                            data_list_className='advertiser-page__data-list'
                                            items={advertiser_page_store.adverts}
                                            keyMapperFn={item => item.id}
                                            rowRenderer={AdvertiserPageRowRenderer}
                                            loadMoreRowsFn={advertiser_page_store.loadMoreAdvertiserAdverts}
                                            has_more_items_to_load={advertiser_page_store.has_more_adverts_to_load}
                                        />
                                    </Table.Body>
                                </Table>
                            ) : (
                                <Empty icon='IcCashierNoAds' title={localize('No ads')} />
                            )}
                        </React.Fragment>
                    )}
                </div>
            </div>
        </div>
    );
});

AdvertiserPage.propTypes = {
    active_index: PropTypes.number,
    advert: PropTypes.object,
    advertiser_info: PropTypes.object,
    adverts: PropTypes.array,
    api_error_message: PropTypes.string,
    counterparty_type: PropTypes.string,
    error_message: PropTypes.string,
    form_error_message: PropTypes.string,
    handleTabItemClick: PropTypes.func,
    height_values: PropTypes.array,
    is_loading: PropTypes.bool,
    is_submit_disabled: PropTypes.bool,
    item_height: PropTypes.number,
    modal_title: PropTypes.string,
    onCancelClick: PropTypes.func,
    onConfirmClick: PropTypes.func,
    onMount: PropTypes.func,
    onTabChange: PropTypes.func,
    setFormErrorMessage: PropTypes.func,
    setIsSubmitDisabled: PropTypes.func,
    setSubmitForm: PropTypes.func,
    show_ad_popup: PropTypes.bool,
    showAdPopup: PropTypes.func,
    submitForm: PropTypes.func,
};

export default AdvertiserPage;
