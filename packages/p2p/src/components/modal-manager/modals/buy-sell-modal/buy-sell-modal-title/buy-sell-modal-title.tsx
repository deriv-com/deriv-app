import React from 'react';
import { Icon, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { isDesktop } from '@deriv/shared';
import { useStores } from 'Stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { buy_sell } from 'Constants/buy-sell';

const BuySellModalTitle = () => {
    const { general_store, buy_sell_store, advertiser_page_store, my_profile_store } = useStores();
    const { selected_ad_state, show_advertiser_page, table_type: buy_sell_table_type } = buy_sell_store;
    const { showModal } = useModalManagerContext();

    const { account_currency } = selected_ad_state;
    const table_type = show_advertiser_page ? advertiser_page_store.counterparty_type : buy_sell_table_type;

    const getModalTitle = () => {
        if (my_profile_store.should_show_add_payment_method_form) {
            if (isDesktop()) {
                return (
                    <div className='buy-sell-modal-title'>
                        <Icon
                            icon='IcArrowLeftBold'
                            data_testid='dt_buy_sell_modal_back_icon'
                            onClick={() => {
                                if (general_store.is_form_modified) {
                                    showModal({
                                        key: 'CancelAddPaymentMethodModal',
                                        props: {},
                                    });
                                } else {
                                    my_profile_store.setShouldShowAddPaymentMethodForm(false);
                                }
                            }}
                            className='buy-sell-modal-title__icon'
                        />
                        <Localize i18n_default_text='Add payment method' />
                    </div>
                );
            }
            return <Localize i18n_default_text='Add payment method' />;
        }
        if (table_type === buy_sell.BUY) {
            return <Localize i18n_default_text='Buy {{ currency }}' values={{ currency: account_currency }} />;
        }
        return <Localize i18n_default_text='Sell {{ currency }}' values={{ currency: account_currency }} />;
    };

    return (
        <Text as='p' color='prominent' weight='bold'>
            {getModalTitle()}
        </Text>
    );
};

export default observer(BuySellModalTitle);
