import PropTypes from 'prop-types';
import React from 'react';
import { MobileWrapper } from '@deriv/components';
import { connect } from 'Stores/connect';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { localize } from '@deriv/translations';
import { unsupported_contract_types_list } from 'Stores/Modules/Trading/Constants/contract';
import { ToastPopup } from 'Modules/Trading/Containers/toast-popup.jsx';
import { getMarketNamesMap } from '../../../Constants';
import ContractTypeWidget from '../Components/Form/ContractType';
import { getAvailableContractTypes } from '../Helpers/contract-type';

const Contract = ({ contract_type, contract_types_list, is_digit_view, is_equal, onChange, symbol }) => {
    const list = getAvailableContractTypes(contract_types_list, unsupported_contract_types_list);

    const digits_message = localize('Last digit stats for latest 1000 ticks for {{ underlying_name }}', {
        underlying_name: getMarketNamesMap()[symbol.toUpperCase()],
    });

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
                is_equal={is_equal}
                list={list}
                name='contract_type'
                onChange={onChange}
                value={contract_type}
            />
        </React.Fragment>
    );
};

Contract.propTypes = {
    contract_type: PropTypes.string,
    contract_types_list: PropTypes.object,
    is_digit_view: PropTypes.bool,
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
};

export default connect(({ modules }) => ({
    contract_type: modules.trade.contract_type,
    contract_types_list: modules.trade.contract_types_list,
    is_digit_view: modules.trade.is_mobile_digit_view_selected,
    is_equal: modules.trade.is_equal,
    onChange: modules.trade.onChange,
    symbol: modules.trade.symbol,
}))(Contract);
