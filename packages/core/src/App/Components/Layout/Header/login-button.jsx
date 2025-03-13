import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@deriv/components';
import { useOauth2 } from '@deriv/hooks';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestOidcAuthentication } from '@deriv-com/auth-client';
import { observer, useStore } from '@deriv/stores';

import './login-button.scss';

const LoginButton = observer(({ className }) => {
    const { isOAuth2Enabled } = useOauth2({});
    const { client } = useStore();
    const { is_single_logging_in } = client;

    if (is_single_logging_in) {
        return <div className='skeleton-loader' />;
    }

    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
                if (isOAuth2Enabled) {
                    await requestOidcAuthentication({
                        redirectCallbackUri: `${window.location.origin}/callback`,
                    });
                }
                window.LiveChatWidget?.call('hide');
                redirectToLogin(false, getLanguage());
            }}
            tertiary
        />
    );
});

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
