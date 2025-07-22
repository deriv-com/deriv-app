import React from 'react';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

import { Button } from '@deriv/components';
import { useTMB } from '@deriv/hooks';
import { getDomainUrl, isStaging, redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';
import { requestOidcAuthentication } from '@deriv-com/auth-client';

const LoginButton = ({ className }) => {
    const is_deriv_com = /deriv\.(com)/.test(window.location.hostname) || /localhost:8443/.test(window.location.host);
    const has_wallet_cookie = Cookies.get('wallet_account');
    const { isTmbEnabled } = useTMB();
    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
                if (has_wallet_cookie) {
                    if (isStaging()) {
                        location.href = `https://staging-hub.${getDomainUrl()}/tradershub/login`;
                    } else {
                        location.href = `https://hub.${getDomainUrl()}/tradershub/login`;
                    }
                }
                const is_tmb_enabled = await isTmbEnabled();
                if (is_deriv_com && !is_tmb_enabled) {
                    try {
                        await requestOidcAuthentication({
                            redirectCallbackUri: `${window.location.origin}/callback`,
                            postLoginRedirectUri: window.location.href,
                        }).catch(err => {
                            // eslint-disable-next-line no-console
                            console.error(err);
                        });
                    } catch (err) {
                        // eslint-disable-next-line no-console
                        console.error(err);
                    }
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
