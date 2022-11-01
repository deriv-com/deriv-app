import * as React from 'react';
import { createPortal } from 'react-dom';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import AccountLimitsContext from './account-limits-context';

const AccountLimitsFooterPortal = () => {
    const { footer_ref, toggleOverlay } = React.useContext(AccountLimitsContext);

    return createPortal(
        <a className='link link--prominent' onClick={toggleOverlay} data-testid='footer_text'>
            <Text size='xxs' line_height='m' weight='bold'>
                <Localize i18n_default_text='Learn more about account limits' />
            </Text>
        </a>,
        footer_ref
    );
};

export default AccountLimitsFooterPortal;
