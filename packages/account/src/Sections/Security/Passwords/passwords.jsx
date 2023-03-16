import React from 'react';
import { Loading } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import DerivPassword from './deriv-password.jsx';
import DerivEmail from './deriv-email.jsx';
import PasswordsPlatform from './passwords-platform.jsx';

const Passwords = observer(() => {
    const [is_loading, setIsLoading] = React.useState(true);
    const { client, ui, common } = useStore();

    React.useEffect(() => {
        if (
            client.is_populating_mt5_account_list === false &&
            client.is_populating_dxtrade_account_list === false &&
            client.is_social_signup !== undefined
        ) {
            setIsLoading(false);
        }
    }, [client.is_populating_mt5_account_list, client.is_populating_dxtrade_account_list, client.is_social_signup]);

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div className='account__passwords'>
            <DerivEmail
                email={client.email}
                social_identity_provider={client.social_identity_provider}
                is_social_signup={client.is_social_signup}
            />
            <DerivPassword
                email={client.email}
                is_dark_mode_on={ui.is_dark_mode_on}
                is_social_signup={client.is_social_signup}
                social_identity_provider={client.social_identity_provider}
            />
            {!common.is_from_derivgo && (client.mt5_login_list?.length > 0 || !client.is_mt5_password_not_set) && (
                <PasswordsPlatform
                    email={client.email}
                    has_mt5_accounts={client.mt5_login_list?.length > 0 || !client.is_mt5_password_not_set}
                />
            )}
            {!common.is_from_derivgo &&
                (client.dxtrade_accounts_list?.length > 0 || !client.is_dxtrade_password_not_set) && (
                    <PasswordsPlatform
                        email={client.email}
                        has_dxtrade_accounts={
                            client.dxtrade_accounts_list?.length > 0 || !client.is_dxtrade_password_not_set
                        }
                    />
                )}
        </div>
    );
});

export default Passwords;
