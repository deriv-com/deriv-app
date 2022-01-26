import React from 'react';
import { Icon, Loading, Text } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { buy_sell } from 'Constants/buy-sell';
import BuySellModal from 'Components/buy-sell/buy-sell-modal.jsx';
import { localize } from 'Components/i18next';
import UserAvatar from 'Components/user/user-avatar/user-avatar.jsx';
import { useStores } from 'Stores';
import AdvertiserPageStats from './advertiser-page-stats.jsx';
import AdvertiserPageAdverts from './advertiser-page-adverts.jsx';
import './advertiser-page.scss';

type AdvertiserPageProps = {
    active_index: number,
    advert: unknown,
    advertiser_info: unknown,
    adverts: unknown,
    api_error_message: string,
    counterparty_type: string,
    error_message: string,
    form_error_message: string,
    handleTabItemClick: () => void,
    height_values: unknown,
    is_loading: boolean,
    is_submit_disabled: boolean,
    item_height: number,
    modal_title: string,
    onCancelClick: () => void,
    onConfirmClick: () => void,
    onMount: () => void,
    onTabChange: () => void,
    setFormErrorMessage: () => void,
    setIsSubmitDisabled: () => void,
    setSubmitForm: () => void,
    show_ad_popup: boolean,
    showAdPopup: () => void,
    submitForm: () => void
};

const AdvertiserPage = () => {
    const { advertiser_page_store } = useStores();

    const { basic_verification, first_name, full_verification, last_name } = advertiser_page_store.advertiser_info;

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

    return (
        <div className='advertiser-page'>
            <BuySellModal
                selected_ad={advertiser_page_store.advert}
                should_show_popup={advertiser_page_store.show_ad_popup}
                setShouldShowPopup={advertiser_page_store.setShowAdPopup}
                table_type={advertiser_page_store.counterparty_type === buy_sell.BUY ? buy_sell.BUY : buy_sell.SELL}
            />
            <div className='advertiser-page__header'>
                <div className='advertiser-page__header-details'>
                    <UserAvatar nickname={advertiser_page_store.advertiser_details_name} size={32} text_size='xxs' />
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
                        <div className='advertiser-page__header-verification-id'>
                            <Text color='less-prominent' size={isMobile() ? 'xxs' : 'xs'} line_height='m'>
                                {localize('ID verified')}
                            </Text>
                            <Icon
                                className='advertiser-page__header-verification-icon'
                                icon='IcCashierVerificationBadge'
                                size={isMobile() ? 12 : 16}
                            />
                        </div>
                    ) : null}
                    {full_verification ? (
                        <div className='advertiser-page__header-verification-status'>
                            <Text color='less-prominent' size={isMobile() ? 'xxs' : 'xs'} line_height='m'>
                                {localize('Address verified')}
                            </Text>
                            <Icon
                                className='advertiser-page__header-verification-icon'
                                icon='IcCashierVerificationBadge'
                                size={isMobile() ? 12 : 16}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
            <AdvertiserPageStats />
            <AdvertiserPageAdverts />
        </div>
    );
};

export default observer(AdvertiserPage);
