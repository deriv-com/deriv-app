import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import DerivPassword from './deriv-password.jsx';
import TradingPassword from './trading-password.jsx';

const Passwords = ({ is_social_signup, is_trading_password_required, social_identity_provider }) => {
    const [is_loading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (is_trading_password_required !== undefined && is_social_signup !== undefined) {
            setIsLoading(false);
        }
    }, [is_trading_password_required, is_social_signup]);

    if (is_loading) {
        return <Loading is_fullscreen={false} />;
    }

    return (
        <div className='account__passwords'>
            {/* Todo: remove the condition after Apple social signup is fully functional from BE side */}
            {social_identity_provider === 'apple' ? null : (
                <DerivPassword
                    is_social_signup={is_social_signup}
                    social_identity_provider={social_identity_provider}
                />
            )}
            <TradingPassword is_trading_password_required={is_trading_password_required} />
        </div>
    );
};
export default connect(({ client }) => ({
    is_social_signup: client.is_social_signup,
    is_trading_password_required: client.is_trading_password_required,
    social_identity_provider: client.social_identity_provider,
}))(Passwords);
