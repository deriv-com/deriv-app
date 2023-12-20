import { WS } from '@deriv/shared';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
// import BinarySocket from '_common/base/socket_base';
import { AuthorizeResponse } from '@deriv/api-types';
import useAPI from './useAPI';

export type SignUpDetails = SignUpFromData;
export type LoginDetails = { accountLoginId: string; accountCurrency: string; accountToken: string };
export type SignUpFromData = {
    citizenship: string;
    password: string;
    residence: string;
};

export type AuthAccount = NonNullable<NonNullable<NonNullable<AuthorizeResponse>['authorize']>['account_list']>['0'];
export type AuthContextType = {
    activeToken: string;
    activeLoginId: string;
    authorizeAccounts: AuthAccount[];
    clientAccounts: object;
    updateLoginId: (loginId: string) => void;
    onSignup: (signUpStuff: SignUpDetails, onCompleteCb: (error?: unknown) => void) => void;
};

function getSignupParams() {
    const param_list = [
        'date_first_contact',
        'signup_device',
        'gclid_url',
        'utm_source',
        'utm_ad_id',
        'utm_adgroup_id',
        'utm_adrollclk_id',
        'utm_campaign_id',
        'utm_campaign',
        'utm_fbcl_id',
        'utm_gl_client_id',
        'utm_msclk_id',
        'utm_medium',
        'utm_term',
        'utm_content',
        'affiliate_token',
    ];
    const signup_params: { [key: string]: string } = {};
    const url_params = new URLSearchParams(window.location.search);

    param_list.forEach(key => {
        if (url_params.get(key)) {
            signup_params[key] = url_params.get(key) ?? '';
        }
    });

    return signup_params;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // const { WS } = useWS();
    const [activeToken, setActiveToken] = useLocalStorage('auth_active_token', '');
    const [activeLoginId, setActiveLoginId] = useLocalStorage('auth_active_login_id', '');
    const [authorizeAccounts, setAuthorizeAccounts] = useLocalStorage<AuthAccount[]>('auth_accounts', []);
    const [clientAccounts, setClientAccounts] = useState({});
    const [redirectAccounts, setRedirectAccounts] = useLocalStorage<object>('auth_redirect_accounts', []);

    const updateLoginId = useCallback(
        (loginId: string) => {
            setActiveLoginId(loginId);
            // @ts-expect-error fix this
            if (!clientAccounts[loginId]) {
                throw new Error('Login ID not found');
            }
            // @ts-expect-error fix this
            const newToken = clientAccounts[loginId]?.token;
            setActiveToken(newToken);
        },
        [clientAccounts, setActiveLoginId, setActiveToken]
    );

    const onSignup = useCallback(
        async (signUpStuff: SignUpDetails, onCompleteCb: (error?: unknown) => void) => {
            const search = window.location.search;
            const searchParams = new URLSearchParams(search);

            if (search && searchParams) {
                const code_param = searchParams?.get('code');

                try {
                    const { new_account_virtual } = await WS.newAccountVirtual(
                        code_param,
                        signUpStuff.password,
                        signUpStuff.residence,
                        getSignupParams()
                    );
                    const { client_id, oauth_token } = new_account_virtual;
                    setActiveLoginId(client_id);
                    setActiveToken(oauth_token);
                    onCompleteCb();
                } catch (error) {
                    onCompleteCb(error);
                }
            }
        },
        [setActiveLoginId, setActiveToken]
    );

    const { send } = useAPI();

    const authorize = useCallback(async () => {
        if (activeToken) {
            // const authorizeResponse: AuthorizeResponse = await WS.pureAuthorize(activeToken);
            const authorizeResponse = await send('authorize', { authorize: activeToken });
            console.log('michio: authorizeResponse', authorizeResponse);
            const accountsList: AuthAccount[] = authorizeResponse.authorize?.account_list as AuthAccount[];
            if (accountsList) {
                setAuthorizeAccounts(accountsList);
            }
        }
    }, [activeToken, send, setAuthorizeAccounts]);

    useEffect(() => {
        const map_names = {
            country: 'residence',
            landing_company_name: 'landing_company_shortcode',
        };
        const client_object = {};

        let active_loginid = '';
        authorizeAccounts.forEach(function (account) {
            const paramKeys = Object.keys(account) as Array<keyof AuthAccount>;
            paramKeys.forEach(param => {
                // @ts-expect-error fix this
                const param_to_set = map_names[param] || param;
                const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                // @ts-expect-error fix this
                if (!(account.loginid in client_object)) {
                    // @ts-expect-error fix this
                    client_object[account.loginid] = {};
                }
                // @ts-expect-error fix this
                client_object[account.loginid][param_to_set] = value_to_set;
                if (param === 'loginid') {
                    if (!active_loginid && !account.is_disabled) {
                        active_loginid = account[param] ?? '';
                    }
                } else {
                    // @ts-expect-error fix this
                    const param_to_set = map_names[param] || param;
                    const value_to_set = typeof account[param] === 'undefined' ? '' : account[param];
                    // @ts-expect-error fix this
                    if (!(account.loginid in client_object)) {
                        // @ts-expect-error fix this
                        client_object[account.loginid] = {};
                    }
                    // @ts-expect-error fix this
                    client_object[account.loginid][param_to_set] = value_to_set;
                }
            });
        });

        let i = 1;
        // @ts-expect-error fix this
        while (redirectAccounts[`acct${i}`]) {
            // @ts-expect-error fix this
            const loginid = redirectAccounts[`acct${i}`];
            // @ts-expect-error fix this
            const token = redirectAccounts[`token${i}`];
            // @ts-expect-error fix this
            if (!client_object[loginid]) {
                // @ts-expect-error fix this
                client_object[loginid] = {};
            }
            if (loginid && token) {
                // @ts-expect-error fix this
                client_object[loginid].token = token;
            }
            i++;
        }

        setClientAccounts(client_object);
    }, [authorizeAccounts, redirectAccounts, setClientAccounts]);

    useEffect(() => {
        const obj_params: { [key: string]: string } = {};
        const search = window.location.search;

        if (search) {
            const search_params = new URLSearchParams(window.location.search);

            search_params.forEach((value, key) => {
                const account_keys = ['acct', 'token', 'cur'];
                const is_account_param = account_keys.some(
                    account_key => key?.includes(account_key) && key !== 'affiliate_token'
                );

                if (is_account_param) {
                    obj_params[key] = value;
                    // is_social_signup_provider = true;
                }
            });
            if (Object.keys(obj_params).length) {
                setActiveToken(obj_params.token1);
                setActiveLoginId(obj_params.acct1);
                setRedirectAccounts(obj_params);
            }
        }
    }, [setActiveLoginId, setActiveToken, setRedirectAccounts]);

    useEffect(() => {
        authorize();
    }, [authorize]);

    const value = useMemo(() => {
        return {
            activeToken,
            activeLoginId,
            authorizeAccounts,
            onSignup,
            clientAccounts,
            updateLoginId,
        };
    }, [activeLoginId, activeToken, authorizeAccounts, clientAccounts, onSignup, updateLoginId]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
