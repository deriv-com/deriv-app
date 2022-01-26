import { AccountLimits } from '@deriv/account';
import { connect } from 'Stores/connect';

export default connect(({ client }) => ({
    account_limits: client.account_limits,
    currency: client.currency,
    getLimits: client.getLimits,
    is_fully_authenticated: client.is_fully_authenticated,
    is_virtual: client.is_virtual,
    is_switching: client.is_switching,
    should_bypass_scrollbars: true,
    is_app_settings: true,
}))(AccountLimits);
