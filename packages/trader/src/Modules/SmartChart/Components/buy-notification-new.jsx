import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { MobileWrapper, Toast } from '@deriv/components';
// import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { findContractCategory } from '../../Trading/Helpers/contract-type';

const BuyNotificationNew = ({ portal_id = 'popup_root', action_toastbox, actionChangeToastbox }) => {
    const { buy_price, currency, contract_type, list } = action_toastbox;
    const active_trade_type = { value: contract_type };

    const getDisplayText = () =>
        findContractCategory(list, active_trade_type)?.contract_types?.find(item => item.value === contract_type).text;

    const trade_type_name = getDisplayText();

    const message = (
        <p>
            The purchase of <strong>{trade_type_name} contract</strong> has been completed for the amount of
            <strong>
                &nbsp; {buy_price} {currency}
            </strong>
        </p>
    );

    if (!document.getElementById(portal_id) || !action_toastbox) return null;

    setTimeout(() => {
        actionChangeToastbox({});
    }, 4000);

    return ReactDOM.createPortal(
        <MobileWrapper>
            <Toast className='dc-toast-popup-mobile' is_open={!!action_toastbox.key} timeout={0} type='notification'>
                {message}
            </Toast>
        </MobileWrapper>,
        document.getElementById(portal_id)
    );
};

BuyNotificationNew.propTypes = {
    portal_id: PropTypes.string,
    action_toastbox: PropTypes.bool,
    actionChangeToastbox: PropTypes.func,
};
export default connect(({ modules }) => ({
    actionChangeToastbox: modules.trade.actionChangeToastbox,
}))(BuyNotificationNew);
