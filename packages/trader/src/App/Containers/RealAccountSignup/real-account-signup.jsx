import classNames            from 'classnames';
import {
    Modal,
    Loading }                from 'deriv-components';
import React, { Component }  from 'react';
import { localize }          from 'App/i18n';
import Localize              from 'App/Components/Elements/localize.jsx';
import Icon                  from 'Assets/icon.jsx';
import IconDuplicate         from 'Assets/Signup/icon-duplicate.jsx';
import { connect }           from 'Stores/connect';
import AccountWizard         from './account-wizard.jsx';
import AddOrManageAccounts   from './add-or-manage-accounts.jsx';
import FinishedSetCurrency   from './finished-set-currency.jsx';
import SuccessDialog         from '../Modals/success-dialog.jsx';
import 'Sass/account-wizard.scss';
import 'Sass/real-account-signup.scss';

const initialState = {
    active_modal_index: -1,
    previous_currency : '',
    current_currency  : '',
    success_message   : '',
    error_message     : '',
};

const modalHeights = {
    account_wizard: {
        0: '650px',
        1: '750px',
        2: '750px',
        3: '700px',
    },
    add_manage_account: '648px',
    set_currency      : '575px',
    error             : '400px',
    add_currency      : '355px',
    change_currency   : '290px',
};

const ErrorModal = ({ message }) => (
    <React.Fragment>
        <IconDuplicate />
        <h1><Localize i18n_default_text='Whoops!' /></h1>
        <p>
            {localize(message)}
        </p>
        <a
            href='https://www.deriv.com/help-centre/'
            type='button'
            className='btn btn--primary--default'
            target='_blank'
            rel='noopener noreferrer'
        >
            {/* TODO: the fontsize is incorrectly overriden somewhere, find the overriding class and remove it */}
            <span className='btn__text' style={{ fontSize: '1.4rem' }}>
                <Localize
                    i18n_default_text='Go To Help Centre'
                />
            </span>
        </a>
    </React.Fragment>
);

const LoadingModal = () => <Loading is_fullscreen={false} />;

class RealAccountSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
            modal_content: [
                {
                    icon : 'IconTheme',
                    value: () => <AccountWizard
                        onSuccessAddCurrency={this.showAddCurrencySuccess}
                        onLoading={this.showLoadingModal}
                        onError={this.showErrorModal}
                        onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        setModalHeight={this.setModalHeight}
                    />,
                },
                {
                    icon : 'IconTheme',
                    value: () => <AddOrManageAccounts
                        onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        onSuccessAddCurrency={this.showAddCurrencySuccess}
                        onLoading={this.showLoadingModal}
                        onError={this.showErrorModal}
                    />,
                },
                {
                    value: () => (
                        <FinishedSetCurrency
                            prev={this.state.previous_currency}
                            current={this.state.current_currency}
                            onCancel={this.closeModal}
                            onSubmit={this.closeModalThenOpenCashier}
                        />
                    ),
                },
                {
                    value: () => (
                        <SuccessDialog
                            has_cancel
                            onCancel={this.closeModalWithHooks}
                            onSubmit={this.closeModalThenOpenCashier}
                            message={this.state.success_message}
                            icon={<Icon type={this.state.current_currency.toLowerCase()} icon='IconAccountsCurrency' />}
                            text_submit={localize('Deposit now')}
                            text_cancel={ RealAccountSignup.text_cancel() }
                        />
                    ),
                },
                {
                    value: () => (
                        <LoadingModal />
                    ),
                },
                {
                    value: () => (
                        <ErrorModal message={this.state.error_message} />
                    ),
                },
            ],
            modal_height: modalHeights.change_currency,
        };
    }

    componentDidMount() {
        const {
            available_crypto_currencies,
            can_change_fiat_currency,
            currency,
            has_real_account,
        } = this.props;

        let height = this.state.height;
        if (!has_real_account) {
            height = modalHeights.account_wizard[0];
        } else if (!currency) {
            height = modalHeights.set_currency;
        } else if (available_crypto_currencies.length !== 0 && can_change_fiat_currency) {
            height = modalHeights.add_manage_account;
        } else {
            height = modalHeights.add_currency;
        }
        this.setState({ modal_height: height });
    }

    setModalHeight = (step) => {
        this.setState({ modal_height: modalHeights.account_wizard[step] });
    }

    get labels () {
        return [
            this.props.currency ? localize('Add a real account') : localize('Set a currency for your Real Account'),
            localize('Add or manage account'),
            null,
            null,
            null,
            localize('Add a real account'),
        ];
    }

    closeModalThenOpenCashier = () => {
        this.props.closeSignupAndOpenCashier();
        setTimeout(() => {
            this.setState(initialState);
        }, 400);
    };

    showSetCurrencySuccess = (previous_currency, current_currency) => {
        this.setState({
            previous_currency,
            current_currency,
            active_modal_index: 2,
            modal_height      : modalHeights.change_currency,
        });
    };

    showAddCurrencySuccess = (currency) => {
        this.setState({
            current_currency  : currency,
            active_modal_index: 3,
            success_message   : <Localize
                i18n_default_text='<0>You have added a Deriv {{currency}} account.</0><0>Make a deposit now to start trading.</0>'
                values={{
                    currency: currency.toUpperCase(),
                }}
                components={[
                    <p key={ currency } />,
                ]}
            />,
            modal_height: modalHeights.add_currency,
        });
    };

    closeModalWithHooks = () => {
        this.closeModal();
        setTimeout(() => {
            const post_signup = JSON.parse(sessionStorage.getItem('post_real_account_signup'));
            if (post_signup && post_signup.category && post_signup.type) {
                sessionStorage.removeItem('post_real_account_signup');
                this.props.enableMt5PasswordModal();
            }
        }, 400);
    };

    showLoadingModal = () => {
        this.setState({
            active_modal_index: 4,
        });
    };

    showErrorModal = (message) => {
        this.setState({
            active_modal_index: 5,
            error_message     : message,
            modal_height      : modalHeights.error,
        });
    };

    closeModal = () => {
        if (this.active_modal_index !== 3) {
            sessionStorage.removeItem('post_real_account_signup');
        }
        this.props.closeRealAccountSignup();
        setTimeout(() => {
            this.setState(initialState);
        }, 400);
    };

    get active_modal_index() {
        const ACCOUNT_WIZARD = 1;
        const ADD_OR_MANAGE_ACCOUNT = 0;

        if (this.state.active_modal_index === -1) {
            return (
                this.props.has_real_account && this.props.currency
            ) ? ACCOUNT_WIZARD : ADD_OR_MANAGE_ACCOUNT;
        }

        return this.state.active_modal_index;
    }

    static text_cancel = () => {
        const post_signup = JSON.parse(sessionStorage.getItem('post_real_account_signup'));
        if (post_signup) {
            return localize('Continue to DMT5');
        }
        return localize('Maybe later');
    };

    render() {
        const { is_real_acc_signup_on } = this.props;
        const title = this.labels[this.active_modal_index];
        const Body  = this.state.modal_content[this.active_modal_index].value;

        return (
            <Modal
                id='real_account_signup_modal'
                className={classNames('real-account-signup-modal', {
                    'dc-modal__container_real-account-signup-modal--error'  : this.active_modal_index === 5,
                    'dc-modal__container_real-account-signup-modal--success': this.active_modal_index >= 2 && this.active_modal_index < 5,
                })}
                is_open={is_real_acc_signup_on}
                has_close_icon={this.active_modal_index < 2 || this.active_modal_index === 5}
                title={title}
                toggleModal={this.closeModal}
                height={this.state.modal_height}
                width='900px'
            >
                <Body />
            </Modal>
        );
    }
}

export default connect(({ ui, client, modules }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency   : client.can_change_fiat_currency,
    has_real_account           : client.has_real_account,
    currency                   : client.currency,
    is_real_acc_signup_on      : ui.is_real_acc_signup_on,
    closeRealAccountSignup     : ui.closeRealAccountSignup,
    closeSignupAndOpenCashier  : ui.closeSignupAndOpenCashier,
    enableMt5PasswordModal     : modules.mt5.enableMt5PasswordModal,
}))(RealAccountSignup);
