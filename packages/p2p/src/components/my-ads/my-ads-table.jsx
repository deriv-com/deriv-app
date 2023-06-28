import classNames from 'classnames';
import React from 'react';
import { Button, HintBox, InfiniteDataList, Loading, Table, Text } from '@deriv/components';
import { isDesktop, isMobile } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import Empty from 'Components/empty/empty.jsx';
import ToggleAds from 'Components/my-ads/toggle-ads.jsx';
import { TableError } from 'Components/table/table-error.jsx';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import MyAdsRowRenderer from './my-ads-row-renderer.jsx';

const getHeaders = offered_currency => [
    { text: localize('Ad ID') },
    { text: localize('Limits') },
    { text: localize('Rate (1 {{ offered_currency }})', { offered_currency }) },
    { text: localize('Available amount') },
    { text: localize('Payment methods') },
    { text: localize('Status') },
    { text: '' }, // empty header for delete and archive icons
];

const AdSwitchHintBox = () => {
    const { floating_rate_store } = useStores();
    const {
        client: { local_currency_config },
    } = useStore();

    if (floating_rate_store.rate_type === ad_type.FLOAT) {
        return floating_rate_store.reached_target_date ? (
            <Localize i18n_default_text='Your ads with fixed rates have been deactivated. Set floating rates to reactivate them.' />
        ) : (
            <Localize
                i18n_default_text={
                    'Floating rates are enabled for {{local_currency}}. Ads with fixed rates will be deactivated. Switch to floating rates by {{end_date}}.'
                }
                values={{
                    local_currency: local_currency_config.currency || '',
                    end_date: floating_rate_store.fixed_rate_adverts_end_date || '',
                }}
            />
        );
    }

    return (
        <Localize i18n_default_text='Your ads with floating rates have been deactivated. Set fixed rates to reactivate them.' />
    );
};

const MyAdsTable = () => {
    const { floating_rate_store, general_store, my_ads_store } = useStores();
    const {
        client: { currency },
    } = useStore();

    React.useEffect(() => {
        my_ads_store.setAdverts([]);
        my_ads_store.setSelectedAdId('');
        my_ads_store.loadMoreAds({ startIndex: 0 }, true);
        general_store.setP2PConfig();
        return () => {
            my_ads_store.setApiErrorCode(null);
            floating_rate_store.setChangeAdAlert(false);
        };
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
                {floating_rate_store.change_ad_alert && (
                    <div className='p2p-my-ads__warning'>
                        <HintBox
                            icon='IcAlertWarning'
                            message={
                                <Text as='p' size='xxxs' color='prominent' line_height='xs'>
                                    <AdSwitchHintBox />
                                </Text>
                            }
                            is_warn
                        />
                    </div>
                )}
                <div className='p2p-my-ads__header'>
                    {isDesktop() && (
                        <Button
                            is_disabled={general_store.is_barred}
                            large
                            onClick={my_ads_store.onClickCreate}
                            primary
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
                                {getHeaders(currency).map(header => (
                                    <Table.Head key={header.text}>{header.text}</Table.Head>
                                ))}
                            </Table.Row>
                        </Table.Header>
                    )}
                    <Table.Body className='p2p-my-ads__table-body'>
                        <InfiniteDataList
                            data_list_className='p2p-my-ads__data-list'
                            has_more_items_to_load={my_ads_store.has_more_items_to_load}
                            items={my_ads_store.adverts}
                            keyMapperFn={item => item.id}
                            loadMoreRowsFn={my_ads_store.loadMoreAds}
                            rowRenderer={row_props => <MyAdsRowRenderer {...row_props} />}
                        />
                    </Table.Body>
                </Table>
                {isMobile() && (
                    <div className='p2p-my-ads__create-container'>
                        <Button
                            className='p2p-my-ads__create'
                            is_disabled={general_store.is_barred}
                            large
                            onClick={my_ads_store.onClickCreate}
                            primary
                        >
                            {localize('Create new ad')}
                        </Button>
                    </div>
                )}
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
