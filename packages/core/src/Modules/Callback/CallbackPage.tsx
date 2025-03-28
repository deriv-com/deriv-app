import { useHistory, withRouter } from 'react-router-dom';

import { Button } from '@deriv/components';
import { routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Callback } from '@deriv-com/auth-client';

const CallbackPage = () => {
    const history = useHistory();
    return (
        <Callback
            onSignInSuccess={(tokens: Record<string, string>) => {
                localStorage.setItem('config.tokens', JSON.stringify(tokens));
                localStorage.setItem('config.account1', tokens.token1);
                localStorage.setItem('active_loginid', tokens.acct1);
                if (!sessionStorage.getItem('active_loginid') && /^(CR|MF|VRTC)\d/.test(tokens.acct1)) {
                    sessionStorage.setItem('active_loginid', tokens.acct1);
                }
                if (!sessionStorage.getItem('active_wallet_loginid') && /^(CRW|MFW|VRW)\d/.test(tokens.acct1)) {
                    sessionStorage.setItem('active_wallet_loginid', tokens.acct1);
                }
                const redirectTo = sessionStorage.getItem('tradershub_redirect_to');
                if (redirectTo) {
                    const params = new URLSearchParams(redirectTo);
                    const queryAccount = params.get('account');

                    let matchingLoginId: string | undefined, matchingToken: string | undefined;
                    if (queryAccount?.toLowerCase() !== 'demo') {
                        Object.keys(tokens).find(key => {
                            if (key.startsWith('cur') && tokens[key] === queryAccount) {
                                const sequence = key.replace('cur', '');
                                const isNotCRWallet =
                                    tokens[`acct${sequence}`]?.startsWith('CR') &&
                                    !tokens[`acct${sequence}`]?.startsWith('CRW');
                                const isNotMFWallet =
                                    tokens[`acct${sequence}`]?.startsWith('MF') &&
                                    !tokens[`acct${sequence}`]?.startsWith('MFW');
                                if (isNotCRWallet || isNotMFWallet) {
                                    if (!matchingLoginId && !matchingToken) {
                                        matchingLoginId = tokens[`acct${sequence}`];
                                        matchingToken = tokens[`token${sequence}`];
                                    }
                                }
                            }
                        });
                    } else {
                        Object.keys(tokens).find(key => {
                            if (key.startsWith('cur') && tokens[key] === queryAccount) {
                                // get currency sequence number, e.g. cur1=1, cur2=2
                                const sequence = key.replace('cur', '');
                                const isDemo = tokens[`acct${sequence}`]?.startsWith('VRTC');

                                if (isDemo) {
                                    matchingLoginId = tokens[`acct${sequence}`];
                                    matchingToken = tokens[`token${sequence}`];
                                }
                            }
                        });
                    }
                    if (matchingLoginId && matchingToken) {
                        sessionStorage.setItem('active_loginid', matchingLoginId);
                        localStorage.setItem('config.account1', matchingToken);
                        localStorage.setItem('active_loginid', matchingLoginId);
                    }

                    sessionStorage.removeItem('tradershub_redirect_to');
                    window.location.href = redirectTo;
                } else {
                    const postLoginRedirectUri = localStorage.getItem('config.post_login_redirect_uri');
                    if (postLoginRedirectUri) {
                        window.location.href = postLoginRedirectUri;
                    } else {
                        window.location.href = routes.traders_hub;
                    }
                }
            }}
            renderReturnButton={() => {
                return (
                    <Button
                        onClick={() => {
                            history.push('/');
                            window.location.reload();
                        }}
                        secondary
                        is_circular
                    >
                        <Localize i18n_default_text='Try again' />
                    </Button>
                );
            }}
        />
    );
};

export default withRouter(CallbackPage);
