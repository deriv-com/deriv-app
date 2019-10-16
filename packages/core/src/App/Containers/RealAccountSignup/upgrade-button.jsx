import { Button } from 'deriv-components';
import PropTypes  from 'prop-types';
import React      from 'react';

const UpgradeButton = ({ children, onClick }) => (
    <div className='acc-switcher__new-account'>
        <Button
            id='upgrade-account'
            onClick={onClick}
            className='acc-switcher__new-account-link'
            primary
        >
            {children}
        </Button>
    </div>
);

UpgradeButton.propTypes = {
    onClick: PropTypes.func,
    text   : PropTypes.string,
};

export default UpgradeButton;
