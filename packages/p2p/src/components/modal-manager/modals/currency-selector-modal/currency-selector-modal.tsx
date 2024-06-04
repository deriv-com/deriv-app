import React from 'react';
import { MobileFullPageModal } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import CurrencySelector from 'Pages/buy-sell/currency-selector/currency-selector';
import { useStores } from 'Stores';

const CurrencySelectorModal = () => {
    const { buy_sell_store } = useStores();
    const { p2p_settings } = useP2PSettings();
    const { onLocalCurrencySelect, selected_local_currency } = buy_sell_store;
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <MobileFullPageModal
            is_flex
            is_modal_open={is_modal_open}
            onClickClose={hideModal}
            page_header_text={localize('Preferred currency')}
            pageHeaderReturnFn={hideModal}
        >
            <CurrencySelector
                default_value={selected_local_currency}
                list={p2p_settings?.currency_list}
                onSelect={value => {
                    onLocalCurrencySelect(value);
                    hideModal();
                }}
            />
        </MobileFullPageModal>
    );
};

export default observer(CurrencySelectorModal);
