import PropTypes from 'prop-types';
import React from 'react';
import { MobileWrapper } from '@deriv/components';
import { connect } from 'Stores/connect';
import { isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import { localize } from '@deriv/translations';
import { unsupported_contract_types_list } from 'Stores/Modules/Trading/Constants/contract';
import { ToastPopup } from 'Modules/Trading/Containers/toast-popup.jsx';
import { isMultiplierContract, useIsMounted } from '@deriv/shared';
import { getMarketNamesMap } from '../../../Constants';
import ContractTypeWidget from '../Components/Form/ContractType';
import { getAvailableContractTypes } from '../Helpers/contract-type';

const Contract = ({
    contract_type,
    contract_types_list,
    current_language,
    is_digit_view,
    is_equal,
    is_logged_in,
    is_logging_in,
    is_switching,
    onChange,
    symbol,
    addNotificationMessageByKey,
    removeNotificationMessageByKey,
}) => {
    const isMounted = useIsMounted();
    const list = getAvailableContractTypes(contract_types_list, unsupported_contract_types_list);

    const digits_message = localize('Last digit stats for latest 1000 ticks for {{ underlying_name }}', {
        underlying_name: getMarketNamesMap()[symbol.toUpperCase()],
    });

    React.useEffect(() => {
        if (!is_logging_in && !is_switching && isMounted()) {
            if (isMultiplierContract(contract_type) && current_language === 'EN' && is_logged_in) {
                addNotificationMessageByKey('deriv_go');
            } else {
                removeNotificationMessageByKey({ key: 'deriv_go' });
            }
        }
    }, [
        contract_type,
        current_language,
        is_logged_in,
        addNotificationMessageByKey,
        removeNotificationMessageByKey,
        isMounted,
        is_switching,
        is_logging_in,
    ]);

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
    is_logged_in: PropTypes.bool,
    current_language: PropTypes.string,
    addNotificationMessageByKey: PropTypes.func,
    removeNotificationMessageByKey: PropTypes.func,
};

export default connect(({ modules, client, common, ui }) => ({
    contract_type: modules.trade.contract_type,
    contract_types_list: modules.trade.contract_types_list,
    is_digit_view: modules.trade.is_mobile_digit_view_selected,
    is_equal: modules.trade.is_equal,
    is_logging_in: client.is_logging_in,
    is_switching: client.is_switching,
    onChange: modules.trade.onChange,
    symbol: modules.trade.symbol,
    is_logged_in: client.is_logged_in,
    current_language: common.current_language,
    addNotificationMessageByKey: ui.addNotificationMessageByKey,
    removeNotificationMessageByKey: ui.removeNotificationMessageByKey,
}))(Contract);
