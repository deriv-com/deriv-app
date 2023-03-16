import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { MobileWrapper, Toast, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { findContractCategory } from '../../Trading/Helpers/contract-type';

const BuyNotificationNew = ({ portal_id = 'popup_root', action_toastbox, actionChangeToastbox }) => {
    const { buy_price, currency, contract_type, list } = action_toastbox;
    const active_trade_type = { value: contract_type };

    const getDisplayText = () =>
        findContractCategory(list, active_trade_type)?.contract_types?.find(item => item.value === contract_type).text;

    const trade_type_name = getDisplayText();

    const message = (
        <Text color='main-1' as='p' size='xxs' className='dc-toast__notification'>
            <Localize
                i18n_default_text='The purchase of <0>{{trade_type_name}} contract</0> has been completed for the amount of <0> {{buy_price}} {{currency}}</0>'
                components={[<strong key={0} />]}
                values={{ trade_type_name, buy_price, currency }}
            />
        </Text>
    );

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            actionChangeToastbox({});
        }, 4000);

        return () => {
            clearTimeout(timeout);
        };
    }, [actionChangeToastbox, action_toastbox]);

    if (!document.getElementById(portal_id) || !action_toastbox) return null;

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
