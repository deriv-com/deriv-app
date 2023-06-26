import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import DerivPassword from './deriv-password.jsx';
import DerivEmail from './deriv-email.jsx';
import PasswordsPlatform from './passwords-platform.jsx';

const Passwords = ({
    email,
    is_dark_mode_on,
    mt5_login_list,
    is_social_signup,
    dxtrade_accounts_list,
    social_identity_provider,
    is_eu_user,
    financial_restricted_countries,
    is_loading_dxtrade,
    is_loading_mt5,
    is_mt5_password_not_set,
    is_dxtrade_password_not_set,
    is_from_derivgo,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);
    React.useEffect(() => {
        if (is_loading_mt5 === false && is_loading_dxtrade === false && is_social_signup !== undefined) {
            setIsLoading(false);
        }
    }, [is_loading_mt5, is_loading_dxtrade, is_social_signup]);

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
};

Passwords.propTypes = {
    email: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    dxtrade_accounts_list: PropTypes.array,
    is_social_signup: PropTypes.bool,
    mt5_login_list: PropTypes.array,
    social_identity_provider: PropTypes.string,
    is_loading_mt5: PropTypes.bool,
    is_loading_dxtrade: PropTypes.bool,
    is_eu_user: PropTypes.bool,
    financial_restricted_countries: PropTypes.bool,
    is_mt5_password_not_set: PropTypes.bool,
    is_dxtrade_password_not_set: PropTypes.bool,
    is_from_derivgo: PropTypes.bool,
};

export default connect(({ client, ui, common, traders_hub }) => ({
    email: client.email,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_social_signup: client.is_social_signup,
    mt5_login_list: client.mt5_login_list,
    dxtrade_accounts_list: client.dxtrade_accounts_list,
    social_identity_provider: client.social_identity_provider,
    is_eu_user: traders_hub.is_eu_user,
    financial_restricted_countries: traders_hub.financial_restricted_countries,
    is_loading_mt5: client.is_populating_mt5_account_list,
    is_loading_dxtrade: client.is_populating_dxtrade_account_list,
    is_mt5_password_not_set: client.is_mt5_password_not_set,
    is_dxtrade_password_not_set: client.is_dxtrade_password_not_set,
    is_from_derivgo: common.is_from_derivgo,
}))(Passwords);
