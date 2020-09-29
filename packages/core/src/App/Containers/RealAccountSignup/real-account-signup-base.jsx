import React from 'react';
import { connect } from 'Stores/connect';
import RealAccountSignup from './real-account-signup.jsx';

const RealAccountSignupBase = ({
    is_logging_in,
    real_account_signup_target,
    setRealAccountSignupTarget,
    has_any_real_account,
}) => {
    const [should_show_real_account, setShowRealAccount] = React.useState(false);

    React.useEffect(() => {
        if (!is_logging_in && !real_account_signup_target) {
            if (has_any_real_account) setRealAccountSignupTarget('manage');
            else setRealAccountSignupTarget();
        } else if (!is_logging_in && real_account_signup_target) {
            setShowRealAccount(true);
        }
    }, [is_logging_in, real_account_signup_target, setRealAccountSignupTarget, has_any_real_account]);

    return should_show_real_account && <RealAccountSignup />;
};

export default connect(({ client, ui }) => ({
    is_logging_in: client.is_logging_in,
    real_account_signup_target: ui.real_account_signup_target,
    has_any_real_account: client.has_any_real_account,
    setRealAccountSignupTarget: ui.setRealAccountSignupTarget,
}))(RealAccountSignupBase);
