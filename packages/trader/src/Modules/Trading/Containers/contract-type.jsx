import PropTypes from 'prop-types';
import React from 'react';
import { MobileWrapper } from '@deriv/components';
import { connect } from 'Stores/connect';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { localize } from '@deriv/translations';
import { unsupported_contract_types_list } from 'Stores/Modules/Trading/Constants/contract';
import { ToastPopup } from 'Modules/Trading/Containers/toast-popup.jsx';
import { isMultiplierContract } from '@deriv/shared';
import { getMarketNamesMap } from '../../../Constants';
import ContractTypeWidget from '../Components/Form/ContractType';
import { getAvailableContractTypes } from '../Helpers/contract-type';

const Contract = ({
    addNotificationMessageByKey,
    contract_type,
    contract_types_list,
    current_language,
    is_digit_view,
    is_equal,
    is_logged_in,
    onChange,
    removeNotificationMessageByKey,
    symbol,
}) => {
    const list = getAvailableContractTypes(contract_types_list, unsupported_contract_types_list);

    const digits_message = localize('Last digit stats for latest 1000 ticks for {{ underlying_name }}', {
        underlying_name: getMarketNamesMap()[symbol.toUpperCase()],
    });

    React.useEffect(() => {
        if (isMultiplierContract(contract_type) && current_language === 'EN' && is_logged_in) {
            addNotificationMessageByKey('deriv_go');
        } else {
            removeNotificationMessageByKey({ key: 'deriv_go' });
        }
    }, [addNotificationMessageByKey, contract_type, current_language, is_logged_in, removeNotificationMessageByKey]);

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
    addNotificationMessageByKey: PropTypes.func,
    removeNotificationMessageByKey: PropTypes.func,
};

export default connect(({ client, common, modules, ui }) => ({
    addNotificationMessageByKey: ui.addNotificationMessageByKey,
    contract_type: modules.trade.contract_type,
    contract_types_list: modules.trade.contract_types_list,
    current_language: common.current_language,
    is_digit_view: modules.trade.is_mobile_digit_view_selected,
    is_equal: modules.trade.is_equal,
    is_logged_in: client.is_logged_in,
    onChange: modules.trade.onChange,
    removeNotificationMessageByKey: ui.removeNotificationMessageByKey,
    symbol: modules.trade.symbol,
}))(Contract);
