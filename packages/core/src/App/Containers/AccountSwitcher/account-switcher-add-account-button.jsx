import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@deriv/components';
import UpgradeButton from 'App/Containers/RealAccountSignup/upgrade-button.jsx';

const ButtonAddAccount = ({ is_currency_required = true, has_set_currency, onClick, text, toggleSetCurrency }) => {
    const handleClick = has_set_currency ? onClick : toggleSetCurrency;
    return (
        <UpgradeButton
            onClick={is_currency_required ? handleClick : onClick}
            icon={<Icon icon='IcAddCircle' color='red' size={24} />}
        >
            {text}
        </UpgradeButton>
    );
};

ButtonAddAccount.propTypes = {
    has_set_currency: PropTypes.bool,
    is_currency_required: PropTypes.bool,
    onClick: PropTypes.func,
    text: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default ButtonAddAccount;
