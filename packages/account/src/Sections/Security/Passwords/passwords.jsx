import React from 'react';
import { connect } from 'Stores/connect';
import DerivPassword from './deriv-password.jsx';
import TradingPassword from './trading-password.jsx';

const Passwords = ({ social_identity_provider }) => (
    <div className='account__passwords'>
        {/* Todo: remove the condition after Apple social signup is fully functional from BE side */}
        {social_identity_provider === 'apple' ? null : <DerivPassword />}
        <TradingPassword />
    </div>
);

export default connect(({ client }) => ({
    social_identity_provider: client.social_identity_provider,
}))(Passwords);
