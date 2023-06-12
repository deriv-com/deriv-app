import React from 'react';
import { MobileFullPageModal } from '@deriv/components';
import { useStores } from 'Stores';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import BuySellHeaderCurrencySelector from 'Components/buy-sell/buy-sell-header/buy-sell-header-currency-selector';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const CurrencySelectorModal = () => {
    const { buy_sell_store } = useStores();
    const { local_currencies, onLocalCurrencySelect, selected_local_currency } = buy_sell_store;
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <MobileFullPageModal
            is_flex
            is_modal_open={is_modal_open}
            page_header_text={localize('Preferred currency')}
            pageHeaderReturnFn={hideModal}
        >
            <BuySellHeaderCurrencySelector
                default_value={selected_local_currency}
                list={local_currencies}
                onSelect={value => {
                    onLocalCurrencySelect(value);
                    hideModal();
                }}
            />
        </MobileFullPageModal>
    );
};

export default observer(CurrencySelectorModal);
