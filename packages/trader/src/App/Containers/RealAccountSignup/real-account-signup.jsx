import classNames           from 'classnames';
import { Modal }            from 'deriv-components';
import React, { Component } from 'react';
import { localize }         from 'App/i18n';
import Localize             from 'App/Components/Elements/localize.jsx';
import Icon                 from 'Assets/icon.jsx';
import { connect }          from 'Stores/connect';
import AccountWizard        from './account-wizard.jsx';
import AddOrManageAccounts  from './add-or-manage-accounts.jsx';
import FinishedSetCurrency  from './finished-set-currency.jsx';
import SuccessDialog        from '../Modals/success-dialog.jsx';
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
                        onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
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
                        <SuccessDialog
                            has_cancel
                            onCancel={this.closeModalWithHooks}
                            onSubmit={this.closeModalThenOpenCashier}
                            message={this.state.success_message}
                            icon={<Icon type={this.state.current_currency.toLowerCase()} icon='IconAccountsCurrency' />}
                            text_submit={localize('Deposit now')}
                            text_cancel={this.text_cancel}
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
                i18n_default_text='<0>You have added a Deriv {{currency}} account.</0><0>Make a deposit now to start trading.</0>'
                values={{
                    currency: currency.toUpperCase(),
                }}
                components={[
                    <p />
                ]}
            />
        })
    }

    closeModalWithHooks = () => {
        this.closeModal();
        setTimeout(() => {
            const post_signup = JSON.parse(sessionStorage.getItem('post_real_account_signup'));
            if (post_signup.category && post_signup.type) {
                sessionStorage.removeItem('post_real_account_signup');
                this.props.enableMt5PasswordModal();
            }
        }, 400);
    }

    closeModal = () => {
        if (this.active_modal_index !== 3) {
            sessionStorage.removeItem('post_real_account_signup');
        }
        this.props.closeRealAccountSignup();
        setTimeout(() => {
            this.setState(initialState);
        }, 400)
    };

    get active_modal_index() {
        const ACCOUNT_WIZARD = 1;
        const ADD_OR_MANAGE_ACCOUNT = 0;

        if (this.state.active_modal_index === -1) {
            return (
                this.props.has_real_account && this.props.has_currency
            ) ? ACCOUNT_WIZARD : ADD_OR_MANAGE_ACCOUNT;
        }

        return this.state.active_modal_index;
    }

    get text_cancel () {
        const post_signup = JSON.parse(sessionStorage.getItem('post_real_account_signup'));
        if (post_signup) {
            return localize('Proceed to create MT5 password');
        }
        return localize('Maybe later');
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

export default connect(({ ui, client, modules }) => ({
    has_real_account         : client.has_real_account,
    has_currency             : !!client.currency,
    is_real_acc_signup_on    : ui.is_real_acc_signup_on,
    closeRealAccountSignup   : ui.closeRealAccountSignup,
    closeSignupAndOpenCashier: ui.closeSignupAndOpenCashier,
    enableMt5PasswordModal   : modules.mt5.enableMt5PasswordModal,
}))(RealAccountSignup);
