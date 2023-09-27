import React from 'react';
import { MobileWrapper, usePrevious } from '@deriv/components';
import { getMarketNamesMap, unsupported_contract_types_list } from '@deriv/shared';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { localize } from '@deriv/translations';
import { ToastPopup } from 'Modules/Trading/Containers/toast-popup';
import ContractTypeWidget from '../Components/Form/ContractType';
import { getAvailableContractTypes } from '../Helpers/contract-type';
import { useTraderStore } from 'Stores/useTraderStores';
import { observer, useStore } from '@deriv/stores';

const Contract = observer(() => {
    const {
        contract_type,
        contract_types_list,
        is_mobile_digit_view_selected: is_digit_view,
        onChange,
        symbol,
    } = useTraderStore();
    const {
        common: { current_language },
    } = useStore();

    const list = getAvailableContractTypes(
        contract_types_list as unknown as Parameters<typeof getAvailableContractTypes>[0],
        unsupported_contract_types_list
    );
    const digits_message = localize('Last digit stats for latest 1000 ticks for {{ underlying_name }}', {
        underlying_name: getMarketNamesMap()[symbol.toUpperCase() as keyof ReturnType<typeof getMarketNamesMap>],
    });
    const prev_lang = usePrevious(current_language);
    return (
        <React.Fragment>
            <MobileWrapper>
                {isDigitTradeType(contract_type) && (
                    <ToastPopup className='digits__toast-info' is_open={is_digit_view} type='info' timeout={3000}>
                        {digits_message}
                    </ToastPopup>
                )}
            </MobileWrapper>
            <ContractTypeWidget
                list={list}
                name='contract_type'
                onChange={e => onChange({ target: { name: e.target?.name || '', value: e.target?.value } })}
                value={contract_type}
                languageChanged={!!(prev_lang && prev_lang !== current_language)}
            />
        </React.Fragment>
    );
});

export default Contract;
