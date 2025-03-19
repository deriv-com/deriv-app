import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@deriv/components';
import { useOauth2 } from '@deriv/hooks';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestOidcAuthentication } from '@deriv-com/auth-client';

const LoginButton = ({ className }) => {
    const { isOAuth2Enabled } = useOauth2({});
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
                        postLoginRedirectUri: `${window.location.origin}${window.location.pathname}`,
                    });
                }
                window.LiveChatWidget?.call('hide');
                redirectToLogin(false, getLanguage());
            }}
            tertiary
        />
    );
};

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
