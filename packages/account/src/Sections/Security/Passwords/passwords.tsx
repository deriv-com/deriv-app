import React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import DerivPassword from './deriv-password';
import DerivEmail from './deriv-email';
import PasswordsPlatform from './passwords-platform';

/**
 *  Displays the Email, Password, section under Account settings.
 * @name Passwords
 * @returns {React.ReactNode}
 */
const Passwords = observer(() => {
    const { client, common } = useStore();
    const {
        is_populating_mt5_account_list,
        is_populating_dxtrade_account_list,
        is_social_signup,
        mt5_login_list,
        is_mt5_password_not_set,
        dxtrade_accounts_list,
        is_dxtrade_password_not_set,
    } = client;
    const { is_from_derivgo } = common;

    const [is_loading, setIsLoading] = React.useState(true);

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
            <DerivEmail />
            <DerivPassword />
            {!is_from_derivgo && (mt5_login_list?.length > 0 || !is_mt5_password_not_set) && (
                <PasswordsPlatform has_mt5_accounts={mt5_login_list?.length > 0 || !is_mt5_password_not_set} />
            )}
            {!is_from_derivgo && (dxtrade_accounts_list?.length > 0 || !is_dxtrade_password_not_set) && (
                <PasswordsPlatform
                    has_dxtrade_accounts={dxtrade_accounts_list?.length > 0 || !is_dxtrade_password_not_set}
                />
            )}
        </div>
    );
});

export default Passwords;
