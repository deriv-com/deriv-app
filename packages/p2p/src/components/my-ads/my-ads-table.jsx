import classNames from 'classnames';
import React from 'react';
import { Button, InfiniteDataList, Loading, Modal, Table, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import ToggleAds from 'Components/my-ads/toggle-ads.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { useStores } from 'Stores';
import MyAdsDeleteModal from './my-ads-delete-modal.jsx';
import MyAdsRowRenderer from './my-ads-row-renderer.jsx';

const getHeaders = offered_currency => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Available amount') },
    { text: localize('Status') },
    { text: '' }, // empty header for delete and archive icons
];

const MyAdsTable = () => {
    const { general_store, my_ads_store } = useStores();

    React.useEffect(() => {
        my_ads_store.setAdverts([]);
        my_ads_store.loadMoreAds({ startIndex: 0 }, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_ads_store.is_table_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (my_ads_store.api_error_message) {
        return <TableError message={my_ads_store.api_error_message} />;
    }

    if (my_ads_store.adverts.length) {
        return (
            <React.Fragment>
                <div className='p2p-my-ads__header'>
                    {isDesktop() && (
                        <Button
                            large
                            primary
                            is_disabled={general_store.is_barred}
                            onClick={my_ads_store.onClickCreate}
                        >
                            {localize('Create new ad')}
                        </Button>
                    )}
                    <ToggleAds />
                </div>
                <Table
                    className={classNames('p2p-my-ads__table', {
                        'p2p-my-ads__table--disabled': !general_store.is_listed || general_store.is_barred,
                    })}
                >
                    {isDesktop() && (
                        <Table.Header>
                            <Table.Row className='p2p-my-ads__table-row'>
                                {getHeaders(general_store.client.currency).map(header => (
                                    <Table.Head key={header.text}>{header.text}</Table.Head>
                                ))}
                            </Table.Row>
                        </Table.Header>
                    )}
                    <Table.Body className='p2p-my-ads__table-body'>
                        <InfiniteDataList
                            data_list_className='p2p-my-ads__data-list'
                            items={my_ads_store.adverts}
                            rowRenderer={row_props => <MyAdsRowRenderer {...row_props} />}
                            has_more_items_to_load={my_ads_store.has_more_items_to_load}
                            loadMoreRowsFn={my_ads_store.loadMoreAds}
                            keyMapperFn={item => item.id}
                            getRowSize={() => (isMobile() ? 151 : 75)}
                        />
                    </Table.Body>
                </Table>

                {isMobile() && (
                    <div className='p2p-my-ads__create-container'>
                        <Button className='p2p-my-ads__create' large primary onClick={my_ads_store.onClickCreate}>
                            {localize('Create new ad')}
                        </Button>
                    </div>
                )}
                <MyAdsDeleteModal />
                <Modal
                    has_close_icon={false}
                    is_open={my_ads_store.is_ad_not_listed_modal_visible}
                    small
                    title={localize('Your ad exceeds the daily limit')}
                >
                    <Modal.Body>
                        <Text>
                            <Localize
                                i18n_default_text='Your ad is not listed on Buy/Sell because the amount exceeds your daily limit of [limit] [currency].
You can still see your ad on My ads. If you’d like to increase your daily limit, please contact us via live chat.'
                            />
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            has_effect
                            large
                            onClick={() => my_ads_store.setIsAdNotListedModalVisible(false)}
                            primary
                            text={localize('Ok')}
                        />
                    </Modal.Footer>
                </Modal>
                <Modal
                    className='p2p-my-ads__modal-error'
                    has_close_icon={false}
                    is_open={my_ads_store.activate_deactivate_error_message}
                    small
                    title={localize('Something’s not right')}
                >
                    <Modal.Body>
                        <Text as='p' size='xs' color='prominent'>
                            {my_ads_store.activate_deactivate_error_message}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            has_effect
                            large
                            onClick={() => my_ads_store.setActivateDeactivateErrorMessage('')}
                            primary
                            text={localize('Ok')}
                        />
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }

    return (
        <Empty icon='IcCashierNoAds' title={localize('You have no ads.')}>
            <Button
                className='p2p-empty__button'
                is_disabled={general_store.is_barred}
                onClick={() => my_ads_store.onClickCreate()}
                large
                primary
            >
                {localize('Create new ad')}
            </Button>
        </Empty>
    );
};

export default observer(MyAdsTable);
