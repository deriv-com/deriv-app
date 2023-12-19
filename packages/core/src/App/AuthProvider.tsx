import { WS } from '@deriv/shared';
import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import BinarySocket from '_common/base/socket_base';
import { AuthorizeResponse } from '@deriv/api-types';

export type SignUpDetails = SignUpFromData;
export type LoginDetails = { accountLoginId: string; accountCurrency: string; accountToken: string };
export type SignUpFromData = {
    citizenship: string;
    password: string;
    residence: string;
};
export type AuthContextType = {
    activeToken: string;
    activeLoginId: string;
    accounts: string[];
    updateActiveLoginId: (loginId: string) => void;
    onSignup: (signUpStuff: SignUpDetails) => void;
    onSignupForm: (fromData: SignUpFromData, onCompleteCb?: () => void) => void;
    onLogin: () => void;
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
    const [activeToken, setActiveToken] = useLocalStorage('auth_active_token', '');
    const [activeLoginId, setActiveLoginId] = useLocalStorage('auth_active_login_id', '');
    const [accounts, setAccounts] = React.useState<string[]>([]);

    const onSignup = useCallback(
        async (signUpStuff: SignUpDetails) => {
            const search = window.location.search;
            const searchParams = new URLSearchParams(search);

            if (search && searchParams) {
                const code_param = searchParams?.get('code');

                const { new_account_virtual } = await WS.newAccountVirtual(
                    code_param,
                    signUpStuff.password,
                    signUpStuff.residence,
                    getSignupParams()
                );
                const { client_id, currency, oauth_token } = new_account_virtual;
                setActiveLoginId(client_id);
                setActiveToken(oauth_token);
            }
        },
        [setActiveLoginId, setActiveToken]
    );

    const onSignupForm = useCallback(
        (signUpFormData: SignUpFromData, onCompleteCb: () => void) => {
            onSignup(signUpFormData);
        },
        [onSignup]
    );

    const onLogin = useCallback((loginStuff: LoginDetails[]) => {
        console.log('michio: onLogin', loginStuff);
    }, []);

    const updateActiveLoginId = useCallback(
        (loginId: string) => {
            setActiveLoginId(loginId);
        },
        [setActiveLoginId]
    );
    const init = useCallback(async () => {
        if (activeToken) {
            const authorizeResponse: AuthorizeResponse = await BinarySocket.authorize(activeToken);
            const accountsList = authorizeResponse.authorize?.account_list;
        }
    }, [activeToken]);

    useEffect(() => {
        init();
    }, [init]);

    const value = useMemo(() => {
        return {
            activeToken,
            activeLoginId,
            accounts,
            updateActiveLoginId,
            onLogin,
            onSignup,
            onSignupForm,
        };
    }, [accounts, activeLoginId, activeToken, onLogin, onSignup, onSignupForm, updateActiveLoginId]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
