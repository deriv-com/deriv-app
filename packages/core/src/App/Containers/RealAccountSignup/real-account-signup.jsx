import classNames from 'classnames';
import { Icon, Button, Modal, Loading, DesktopWrapper, MobileWrapper } from '@deriv/components';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { localize, Localize } from '@deriv/translations';
import routes from 'Constants/routes';
import { connect } from 'Stores/connect';
import { getDerivComLink } from '_common/url';
import AccountSignupUnavailableModal from './account-signup-unavailable-modal.jsx';
import AccountWizard from './account-wizard.jsx';
import AddOrManageAccounts from './add-or-manage-accounts.jsx';
import FinishedSetCurrency from './finished-set-currency.jsx';
import SuccessDialog from '../Modals/success-dialog.jsx';
import 'Sass/account-wizard.scss';
import 'Sass/real-account-signup.scss';

const ErrorModal = ({ message, code, openPersonalDetails }) => {
    return (
        <div className='account-wizard--error'>
            <Icon icon='IcAccountError' size={115} />
            <h1>
                <Localize i18n_default_text='Whoops!' />
            </h1>
            <p>{localize(message)}</p>
            {code !== 'InvalidPhone' && (
                <a
                    href={getDerivComLink('help-centre')}
                    type='button'
                    className='dc-btn dc-btn--primary dc-btn__medium'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    <span className='dc-btn__text'>
                        <Localize i18n_default_text='Go To Help Centre' />
                    </span>
                </a>
            )}
            {code === 'InvalidPhone' && (
                <Button primary onClick={openPersonalDetails}>
                    <Localize i18n_default_text='Try again using a different number' />
                </Button>
            )}
        </div>
    );
};

const LoadingModal = () => <Loading is_fullscreen={false} />;

class RealAccountSignup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_content: [
                {
                    value: () => (
                        <AccountWizard
                            onSuccessAddCurrency={this.showAddCurrencySuccess}
                            onLoading={this.showLoadingModal}
                            onError={this.showErrorModal}
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        />
                    ),
                },
                {
                    value: () => (
                        <AddOrManageAccounts
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                            onSuccessAddCurrency={this.showAddCurrencySuccess}
                            onLoading={this.showLoadingModal}
                            onError={this.showErrorModal}
                        />
                    ),
                },
                {
                    value: () => (
                        <FinishedSetCurrency
                            prev={this.props.state_value.previous_currency}
                            current={this.props.state_value.current_currency}
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
                            message={this.props.state_value.success_message}
                            icon={
                                <Icon
                                    icon={`IcCurrency-${this.props.state_value.current_currency.toLowerCase()}`}
                                    size={120}
                                />
                            }
                            text_submit={localize('Deposit now')}
                            text_cancel={RealAccountSignup.text_cancel()}
                        />
                    ),
                },
                {
                    value: () => <LoadingModal />,
                },
                {
                    value: () => (
                        <ErrorModal
                            message={this.props.state_value.error_message}
                            code={this.props.state_value.error_code}
                            openPersonalDetails={this.openPersonalDetails}
                        />
                    ),
                },
            ],
        };
    }

    get modal_height() {
        const { currency, has_real_account } = this.props;
        if (!currency) return '688px'; // Set currency modal
        if (has_real_account && currency) return '702px'; // Add or manage account modal
        return '740px'; // Account wizard modal
    }

    get labels() {
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
        this.props.closeRealAccountSignup();
        this.props.history.push(routes.cashier_deposit);
    };

    showSetCurrencySuccess = (previous_currency, current_currency) => {
        this.props.setParams({
            previous_currency,
            current_currency,
            active_modal_index: 2,
        });
    };

    showAddCurrencySuccess = currency => {
        this.props.setParams({
            current_currency: currency,
            active_modal_index: 3,
            success_message: (
                <Localize
                    i18n_default_text='<0>You have added a Deriv {{currency}} account.</0><0>Make a deposit now to start trading.</0>'
                    values={{
                        currency: currency.toUpperCase(),
                    }}
                    components={[<p key={currency} />]}
                />
            ),
        });
    };

    closeModalWithHooks = () => {
        this.closeModal();
    };

    showLoadingModal = () => {
        this.props.setParams({
            active_modal_index: 4,
        });
    };

    cacheFormValues = payload => {
        localStorage.setItem(
            'real_account_signup_wizard',
            JSON.stringify(
                payload.map(item => {
                    if (typeof item.form_value === 'object') {
                        return item.form_value;
                    }
                    return false;
                })
            )
        );
    };

    showErrorModal = (error, payload) => {
        if (payload) {
            this.cacheFormValues(payload);
        }

        this.props.setParams({
            active_modal_index: 5,
            error_message: error.message,
            error_code: error.code,
        });
    };

    closeModal = () => {
        if (this.active_modal_index !== 3) {
            sessionStorage.removeItem('post_real_account_signup');
            localStorage.removeItem('real_account_signup_wizard');
        }
        this.props.closeRealAccountSignup();
    };

    openPersonalDetails = () => {
        this.props.setParams({
            active_modal_index: 0,
        });
    };

    get active_modal_index() {
        const ACCOUNT_WIZARD = 1;
        const ADD_OR_MANAGE_ACCOUNT = 0;

        if (this.props.state_value.active_modal_index === -1) {
            return this.props.has_real_account && this.props.currency ? ACCOUNT_WIZARD : ADD_OR_MANAGE_ACCOUNT;
        }

        return this.props.state_value.active_modal_index;
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
        const Body = this.state.modal_content[this.active_modal_index].value;

        return (
            <>
                <DesktopWrapper>
                    <Modal
                        id='real_account_signup_modal'
                        className={classNames('real-account-signup-modal', {
                            'dc-modal__container_real-account-signup-modal--error': this.active_modal_index === 5,
                            'dc-modal__container_real-account-signup-modal--success':
                                this.active_modal_index >= 2 && this.active_modal_index < 5,
                        })}
                        is_open={is_real_acc_signup_on}
                        has_close_icon={this.active_modal_index < 2 || this.active_modal_index === 5}
                        title={title}
                        toggleModal={this.closeModal}
                        height={this.modal_height}
                        width='904px'
                    >
                        <Body />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    {/* TODO: remove this modal once real account signup is ready for mobile  */}
                    <AccountSignupUnavailableModal is_visible={is_real_acc_signup_on} toggleModal={this.closeModal} />
                </MobileWrapper>
            </>
        );
    }
}

export default connect(({ ui, client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    has_real_account: client.has_active_real_account,
    currency: client.currency,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    setParams: ui.setRealAccountSignupParams,
    state_value: ui.real_account_signup,
}))(withRouter(RealAccountSignup));
