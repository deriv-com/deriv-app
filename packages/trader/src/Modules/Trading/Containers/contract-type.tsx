import React from 'react';
import { MobileWrapper, usePrevious } from '@deriv/components';
import { getMarketNamesMap, unsupported_contract_types_list } from '@deriv/shared';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { Localize } from '@deriv/translations';
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
        non_available_contract_types_list,
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
    const unavailable_trade_types_list = getAvailableContractTypes(
        non_available_contract_types_list,
        unsupported_contract_types_list
    ).map(item => ({ ...item, is_unavailable: true }));
    const prev_lang = usePrevious(current_language);
    return (
        <React.Fragment>
            <MobileWrapper>
                {isDigitTradeType(contract_type) && (
                    <ToastPopup className='digits__toast-info' is_open={is_digit_view} type='info' timeout={3000}>
                        <Localize
                            i18n_default_text='Last digit stats for latest 1000 ticks for {{underlying_name}}'
                            values={{
                                underlying_name:
                                    getMarketNamesMap()[
                                        symbol?.toUpperCase() as keyof ReturnType<typeof getMarketNamesMap>
                                    ],
                            }}
                        />
                    </ToastPopup>
                )}
            </MobileWrapper>
            <ContractTypeWidget
                list={list}
                name='contract_type'
                onChange={onChange}
                value={contract_type}
                languageChanged={!!(prev_lang && prev_lang !== current_language)}
                unavailable_trade_types_list={unavailable_trade_types_list}
            />
        </React.Fragment>
    );
});

export default Contract;
