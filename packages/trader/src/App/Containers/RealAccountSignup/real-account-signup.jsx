import classNames            from 'classnames';
import { Modal }             from 'deriv-components';
import React, { Component }  from 'react';
import { localize }          from 'App/i18n';
import Localize              from 'App/Components/Elements/localize.jsx';
import { connect }           from 'Stores/connect';
import AccountWizard         from './account-wizard.jsx';
import AddOrManageAccounts   from './add-or-manage-accounts.jsx';
import FinishedSetCurrency   from './finished-set-currency.jsx';
import SuccessCurrencyDialog from './success-currency-dialog.jsx';
import 'Sass/account-wizard.scss';
import 'Sass/real-account-signup.scss';

const initialState = {
    active_modal_index: -1,
    previous_currency : '',
    current_currency  : '',
    success_message   : '',
};

class RealAccountSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
            modal_content     : [
                {
                    icon : 'IconTheme',
                    label: localize('Add a real account'),
                    value: () => <AccountWizard
                        onSuccessAddCurrency={this.showAddCurrencySuccess}
                    />,
                },
                {
                    icon : 'IconTheme',
                    label: localize('Add or manage account'),
                    value: () => <AddOrManageAccounts
                        onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        onSuccessAddCurrency={this.showAddCurrencySuccess}
                    />,
                },
                {
                    label: false,
                    value: () => (
                        <FinishedSetCurrency
                            prev={this.state.previous_currency}
                            current={this.state.current_currency}
                            onCancel={this.closeModal}
                            onSubmit={this.closeModalThenOpenCashier}
                        />
                    ),
                    title: false,
                },
                {
                    label: false,
                    value: () => (
                        <SuccessCurrencyDialog
                            current={this.state.current_currency}
                            onCancel={this.closeModal}
                            onSubmit={this.closeModalThenOpenCashier}
                            success_message={this.state.success_message}
                        />
                    )
                }
            ],
        };
    }

    closeModalThenOpenCashier = (e) => {
        this.props.closeSignupAndOpenCashier();
        setTimeout(() => {
            this.setState(initialState);
        }, 400)
    }
    showSetCurrencySuccess = (previous_currency, current_currency) => {
        this.setState({
            previous_currency,
            current_currency,
            active_modal_index: 2,
        });
    };

    showAddCurrencySuccess = (currency) => {
        this.setState({
            current_currency: currency,
            active_modal_index: 3,
            success_message: <Localize
                i18n_default_text='You have added a {{currency}} account.<0 />Make a deposit now to start trading.'
                values={{
                    currency: currency,
                }}
                components={[
                    <br />
                ]}
            />
        })
    }

    closeModal = () => {
        this.props.closeRealAccountSignup();
        setTimeout(() => {
            this.setState(initialState);
        }, 400)
    };

    get active_modal_index() {
        if (this.state.active_modal_index === -1) {
            return this.props.has_real_account ? 1 : 0;
        }

        return this.state.active_modal_index;
    }

    render() {
        const { is_real_acc_signup_on } = this.props;
        const title                     = this.state.modal_content[this.active_modal_index].label;
        const Body                      = this.state.modal_content[this.active_modal_index].value;
        return (
            <Modal
                id='real_account_signup_modal'
                className={classNames('real-account-signup-modal', {
                    'dc-modal__container_real-account-signup-modal--success': this.active_modal_index >= 2,
                })}
                is_open={is_real_acc_signup_on}
                has_close_icon={ this.active_modal_index < 2}
                title={title}
                toggleModal={this.closeModal}
            >
                <Body />
            </Modal>
        );
    }
}

export default connect(({ ui, client }) => ({
    has_real_account         : client.has_real_account,
    is_real_acc_signup_on    : ui.is_real_acc_signup_on,
    closeRealAccountSignup   : ui.closeRealAccountSignup,
    closeSignupAndOpenCashier: ui.closeSignupAndOpenCashier,
}))(RealAccountSignup);
