import React         from 'react';
import { Icon }      from 'deriv-components';
import UpgradeButton from 'App/Containers/RealAccountSignup/upgrade-button.jsx';

const ButtonAddAccount = ({
    currency = true,
    onClick,
    text,
    toggleSetCurrency,
}) => {
    const handleClick = currency ? onClick : toggleSetCurrency;
    return (
        <UpgradeButton
            onClick={handleClick}
            icon={<Icon icon='IcAddCircle' color='red' size={24} />}
        >
            {text}
        </UpgradeButton>
    );
};

export default ButtonAddAccount;
