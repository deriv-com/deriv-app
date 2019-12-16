import React         from 'react';
import UpgradeButton from 'App/Containers/RealAccountSignup/upgrade-button.jsx';
import Icon          from 'Assets/icon.jsx';

const ButtonAddAccount = ({
    onClick,
    text,
}) => (
    <UpgradeButton
        onClick={onClick}
        icon={<Icon icon='IconAdd' />}
    >
        {text}
    </UpgradeButton>
);

export default ButtonAddAccount;
