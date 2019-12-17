import React         from 'react';
import UpgradeButton from 'App/Containers/RealAccountSignup/upgrade-button.jsx';
import Icon          from 'Assets/icon.jsx';

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
            icon={<Icon icon='IconAdd' />}
        >
            {text}
        </UpgradeButton>
    );
};

export default ButtonAddAccount;
