import React from 'react';
import DeactivateAccountSteps from './deactivate-account-steps.jsx';
import DeactivateAccountReason from './deactivate-account-reason.jsx';

class DeactivateAccount extends React.Component {
    state = {
        is_modal_open: false,
        accounts_with_balance: {},
        account_closure_message: '',
        is_loading: false,
        render_deactivate_account_reason: false,
    };
    redirectToReasons = () => {
        this.setState({
            render_deactivate_account_reason: true,
        });
    };
    redirectToSteps = () => {
        this.setState({
            render_deactivate_account_reason: false,
        });
    };
    render() {
        return (
            <div className='deactivate-account'>
                {this.state.render_deactivate_account_reason ? (
                    <DeactivateAccountReason onBackClick={this.redirectToSteps} />
                ) : (
                    <DeactivateAccountSteps redirectToReasons={this.redirectToReasons} />
                )}
            </div>
        );
    }
}

export default DeactivateAccount;
