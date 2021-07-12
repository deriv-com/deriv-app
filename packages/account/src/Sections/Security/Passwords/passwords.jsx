import React from 'react';
import PropTypes from 'prop-types';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import DerivPassword from './deriv-password.jsx';
import PasswordsPlatform from './passwords-platform.jsx';

const Passwords = ({
    email,
    is_dark_mode_on,
    is_deriv_x_trading_password_required,
    is_social_signup,
    is_trading_password_required,
    social_identity_provider,
}) => {
    const [is_loading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (
            is_deriv_x_trading_password_required !== undefined &&
            is_trading_password_required !== undefined &&
            is_social_signup !== undefined
        ) {
            setIsLoading(false);
        }
    }, [is_deriv_x_trading_password_required, is_trading_password_required, is_social_signup]);

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div className='account__passwords'>
            {/* Todo: remove the condition after Apple social signup is fully functional from BE side */}
            {social_identity_provider === 'apple' ? null : (
                <DerivPassword
                    email={email}
                    is_dark_mode_on={is_dark_mode_on}
                    is_social_signup={is_social_signup}
                    social_identity_provider={social_identity_provider}
                />
            )}
            {!is_trading_password_required && (
                <PasswordsPlatform has_set_trading_password={!is_trading_password_required} />
            )}
            {!is_deriv_x_trading_password_required && (
                <PasswordsPlatform has_set_deriv_x_trading_password={!is_deriv_x_trading_password_required} />
            )}
        </div>
    );
};

Passwords.propTypes = {
    email: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_deriv_x_trading_password_required: PropTypes.bool,
    is_social_signup: PropTypes.bool,
    is_trading_password_required: PropTypes.bool,
    social_identity_provider: PropTypes.string,
};

export default connect(({ client, ui }) => ({
    email: client.email,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_deriv_x_trading_password_required: client.is_deriv_x_trading_password_required,
    is_social_signup: client.is_social_signup,
    is_trading_password_required: client.is_trading_password_required,
    social_identity_provider: client.social_identity_provider,
}))(Passwords);
