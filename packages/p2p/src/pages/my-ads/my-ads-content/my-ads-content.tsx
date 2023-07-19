import React from 'react';
import { Button, DesktopWrapper, HintBox, Loading, MobileWrapper, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import P2pEmpty from 'Components/p2p-empty';
import TableError from 'Components/section-error';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';
import AdsTable from '../ads-table';
import ToggleAds from '../toggle-ads';

//TODO: below component will be removed when indication for hidden ads card is merged.
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

const AdCreateButton = ({ class_name = '' }: { class_name?: string }) => {
    const { general_store, my_ads_store } = useStores();
    const { is_barred } = general_store;
    const { onClickCreate } = my_ads_store;
    return (
        <Button className={class_name} is_disabled={is_barred} large onClick={onClickCreate} primary>
            <Localize i18n_default_text='Create new ad' />
        </Button>
    );
};

const MyAdsTable = () => {
    const { floating_rate_store, general_store, my_ads_store } = useStores();
    const { setP2PConfig } = general_store;
    const {
        adverts = [],
        api_error_message,
        is_table_loading,
        loadMoreAds,
        setAdverts,
        setApiErrorCode,
        setSelectedAdId,
    } = my_ads_store;

    React.useEffect(() => {
        setAdverts([]);
        setSelectedAdId('');
        loadMoreAds({ startIndex: 0 }, true);
        setP2PConfig();
        return () => {
            setApiErrorCode(null);
            floating_rate_store.setChangeAdAlert(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_table_loading) {
        return <Loading is_fullscreen={false} />;
    }

    if (api_error_message) {
        return <TableError message={api_error_message} className='section-error__table' size='xs' />;
    }

    if (adverts.length) {
        return (
            <React.Fragment>
                {/* TODO: below div will be removed when indication for hidden ads card is merged. */}
                {floating_rate_store.change_ad_alert && (
                    <div className='my-ads-content__warning'>
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
                <div className='my-ads-content__header'>
                    <DesktopWrapper>
                        <AdCreateButton class_name='p2p-empty__button' />
                    </DesktopWrapper>
                    <ToggleAds />
                </div>
                <AdsTable />
                <MobileWrapper>
                    <div className='my-ads-content__create-container'>
                        <AdCreateButton class_name='my-ads-content__create' />
                    </div>
                </MobileWrapper>
            </React.Fragment>
        );
    }

    return (
        <P2pEmpty icon='IcCashierNoAds' title={localize('You have no ads.')}>
            <AdCreateButton class_name='p2p-empty__button' />
        </P2pEmpty>
    );
};

export default observer(MyAdsTable);
