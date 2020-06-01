import React from 'react';
import { localize } from '@deriv/translations';
import { Modal } from '@deriv/components';
// import { WS } from 'Services/ws-methods';
import DeactivateAccountSteps from './deactivate-account-steps';
import DeactivateAccountReason from './deactivate-account-reason';
class DeactivateAccount extends React.Component {
    state = {
        is_modal_open: false,
        accounts_with_balance: {},
        account_closure_message: '',
        is_loading: false,
        render_deactivate_account_reason: false,
    };
    startDeactivatingProcesses = () => {
        this.setState;
    };
    redirectToReasons = () => {
        this.setState({
            render_deactivate_account_reason: true,
        });
    };
    render() {
        return (
            <div className='deactivate-account'>
                {this.state.render_deactivate_account_reason ? (
                    <DeactivateAccountReason />
                ) : (
                    <DeactivateAccountSteps redirectToReasons={this.redirectToReasons} />
                )}
                <Modal
                    className='confirm-all-close'
                    is_open={this.state.is_modal_open}
                    toggleModal={() => this.setState({ is_modal_open: false })}
                    title={localize('Action required')}
                >
                    <Modal.Body>{this.state.is_loading ? 'loading...' : 'modal content'}</Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default DeactivateAccount;

// WS.send(
//     {
//         "account_closure": 1,
//         "reason": null
//     })
//     .then((res) => {
//         console.log(res.error.code);
//         this.setState({
//             account_closure_message: res.error.code,
//             is_loading: false
//         })
//     })
//     .catch((err) => console.log(err));

// const AccountsWithBalance = () => {
//     return (
//         <div className='open-positions'>
//             <p className='open-positions__title'>{localize('You have funds in these Deriv accounts:')}</p>
//         </div>
//     )
// }
// const AccountsWithOpenPositions = () => {
//     <div>open positions</div>
// }
