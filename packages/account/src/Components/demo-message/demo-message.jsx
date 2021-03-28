import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconWithMessage from 'Components/icon-with-message';

const DemoMessage = ({ has_demo_icon, has_account_switcher, toggleAccountsDialog }) => (
    <div className='account__demo-message-wrapper'>
        <IconWithMessage
            icon={has_demo_icon ? 'IcPoaLockDemo' : 'IcPoaLock'}
            message={localize('This feature is not available for demo accounts.')}
        />
        {has_account_switcher && (
            <Button
                primary
                onClick={() => {
                    toggleAccountsDialog();
                }}
                className='account__demo-message-button'
            >
                {localize('Add a real account')}
            </Button>
        )}
    </div>
);

DemoMessage.propTypes = {
    has_demo_icon: PropTypes.bool,
    full_width: PropTypes.bool,
};

export default DemoMessage;
