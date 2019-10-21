import { Button } from 'deriv-components';
import PropTypes  from 'prop-types';
import React      from 'react';

const UpgradeButton = ({ children, onClick, icon }) => (
    <div className='acc-switcher__new-account'>
        <Button
            id='upgrade-account'
            onClick={onClick}
            className='acc-switcher__new-account-link'
            tertiary
            icon={icon}
        >
            {children}
        </Button>
    </div>
);

UpgradeButton.propTypes = {
    icon   : PropTypes.node,
    onClick: PropTypes.func,
    text   : PropTypes.string,
};

export default UpgradeButton;
