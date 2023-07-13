import React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import DerivPassword from './deriv-password.jsx';
import DerivEmail from './deriv-email.jsx';
import PasswordsPlatform from './passwords-platform.jsx';

const Passwords = observer(() => {
    const [is_loading, setIsLoading] = React.useState(true);
    const { client, ui, common, traders_hub } = useStore();
    const {
        is_populating_mt5_account_list,
        is_populating_dxtrade_account_list,
        is_social_signup,
        email,
        social_identity_provider,
        mt5_login_list,
        is_mt5_password_not_set,
        dxtrade_accounts_list,
        is_dxtrade_password_not_set,
    } = client;
    const { is_from_derivgo } = common;
    const { is_eu_user, financial_restricted_countries } = traders_hub;
    const { is_dark_mode_on } = ui;
    React.useEffect(() => {
        if (
            is_populating_mt5_account_list === false &&
            is_populating_dxtrade_account_list === false &&
            is_social_signup !== undefined
        ) {
            setIsLoading(false);
        }
    }, [is_populating_mt5_account_list, is_populating_dxtrade_account_list, is_social_signup]);

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div className='account__passwords'>
            <DerivEmail
                email={email}
                social_identity_provider={social_identity_provider}
                is_social_signup={is_social_signup}
            />
            <DerivPassword
                email={email}
                is_dark_mode_on={is_dark_mode_on}
                is_social_signup={is_social_signup}
                is_eu_user={is_eu_user}
                financial_restricted_countries={financial_restricted_countries}
                social_identity_provider={social_identity_provider}
            />
            {!is_from_derivgo && (mt5_login_list?.length > 0 || !is_mt5_password_not_set) && (
                <PasswordsPlatform
                    email={email}
                    has_mt5_accounts={mt5_login_list?.length > 0 || !is_mt5_password_not_set}
                />
            )}
            {!is_from_derivgo && (dxtrade_accounts_list?.length > 0 || !is_dxtrade_password_not_set) && (
                <PasswordsPlatform
                    email={email}
                    has_dxtrade_accounts={dxtrade_accounts_list?.length > 0 || !is_dxtrade_password_not_set}
                />
            )}
        </div>
    );
});

export default Passwords;
