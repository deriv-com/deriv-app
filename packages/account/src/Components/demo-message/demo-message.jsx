import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const DemoMessage = ({ has_demo_icon, full_width, has_account_switcher, toggleAccountsDialog }) => (
    <div className='account__demo-message-wrapper'>
        <IconMessageContent
            message={localize('This feature is not available for demo accounts.')}
            icon={<Icon icon={has_demo_icon ? 'IcPoaLockDemo' : 'IcPoaLock'} size={128} />}
            full_width={full_width}
        />
        {has_account_switcher && (
            <Button
                primary
                onClick={() => {
                    toggleAccountsDialog();
                }}
                className='account__demo-message-button'
            >
                {localize('Switch accounts')}
            </Button>
        )}
    </div>
);

DemoMessage.propTypes = {
    has_demo_icon: PropTypes.bool,
    full_width: PropTypes.bool,
};

export default DemoMessage;
