import { requestOidcToken, requestLegacyToken } from '@deriv-com/auth-client';
import React, { useCallback, useEffect } from 'react';
import { withRouter, useLocation } from 'react-router-dom';

const SilentCallbackPage = () => {
    const fetchTokens = useCallback(() => {
        try {
            window.parent.postMessage({
                event: 'login_successful',
                value: {
                    acct1: 'abcd1234',
                },
            });
        } catch (err) {
            console.error('unable to exchange tokens during silent login', err);
            window.parent.postMessage({
                event: 'login_error',
                value: err,
            });
        }
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const oneTimeCode = params.get('code');
        const errorType = params.get('error');

        if (errorType === 'login_required') {
            window.parent.postMessage({
                event: 'login_required',
            });
        } else if (errorType === 'consent_required') {
            window.parent.postMessage({
                event: 'login_successful',
                value: {
                    acct1: 'abcd1234',
                },
            });
        } else {
            if (oneTimeCode) {
                fetchTokens();
            }
        }
    }, []);

    return (
        <div>
            <h1>Silent callback</h1>
        </div>
    );
};

export default withRouter(SilentCallbackPage);
