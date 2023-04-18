import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { isMobile } from '@deriv/shared';

const AdErrorTooltipModal = ({ visibility_status = [], account_currency = '', remaining_amount }) => {
    const { my_ads_store, general_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();

    const getAdErrorMessage = error_code => {
        switch (error_code) {
            case 'advert_inactive':
                return (
                    <Localize i18n_default_text='Your ads with fixed rates have been deactivated. Set floating rates to reactivate them.' />
                );
            case 'advert_max_limit':
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than {{maximum_order_amount}} {{currency}}.'
                        values={{
                            balance: my_ads_store.maximum_order_amount,
                            currency: account_currency,
                        }}
                    />
                );
            case 'advert_min_limit':
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its maximum order is lower than the minimum amount you can specify for orders in your ads.'
                        values={{
                            balance: general_store.advertiser_info.balance_available,
                            currency: account_currency,
                        }}
                    />
                );
            case 'advert_remaining':
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than the ad’s remaining amount ({{remaining_amount}} {{currency}}).'
                        values={{
                            remaining_amount,
                            currency: account_currency,
                        }}
                    />
                );
            case 'advertiser_ads_paused':
                return (
                    <Localize i18n_default_text='This ad is not listed on Buy/Sell because you have paused all your ads.' />
                );
            case 'advertiser_balance':
                return (
                    <Localize
                        i18n_default_text='Your ad is not listed on Buy/Sell because its minimum order is higher than your Deriv P2P available balance ({{balance}} {{currency}}).'
                        values={{
                            balance: general_store.advertiser_info.balance_available,
                            currency: account_currency,
                        }}
                    />
                );
            case 'advertiser_daily_limit':
                return (
                    <Localize
                        i18n_default_text='This ad is not listed on Buy/Sell because its minimum order is higher than your remaining daily limit ({{remaining_limit}} {{currency}}).'
                        values={{
                            remaining_limit: my_ads_store.advert_details?.max_order_amount_limit_display,
                            currency: account_currency,
                        }}
                    />
                );
            case 'advertiser_temp_ban':
                return (
                    <Localize i18n_default_text='You’re not allowed to use Deriv P2P to advertise. Please contact us via live chat for more information.' />
                );
            default:
                return <Localize i18n_default_text='Your ad is not listed' />;
        }
    };

    const getMultipleErrorMessages = error_statuses =>
        error_statuses.map((status, index) => (
            <div key={index}>
                {index + 1}. {getAdErrorMessage(status)}
            </div>
        ));

    return (
        <Modal className='p2p-my-ads__modal-error' is_open={is_modal_open} small has_close_icon={false}>
            <Modal.Body>
                <Text as='div' color='prominent' size={isMobile() ? 'xxs' : 'xs'} line_height={isMobile() ? 'l' : 'xl'}>
                    {visibility_status.length === 1 ? (
                        getAdErrorMessage(visibility_status[0])
                    ) : (
                        <div>
                            <Localize i18n_default_text='Your ad isn’t listed on Buy/Sell due to the following reason(s):' />
                            {getMultipleErrorMessages(visibility_status)}
                        </div>
                    )}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={() => hideModal()} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdErrorTooltipModal);
