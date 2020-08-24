import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Modal, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { routes, isNavigationFromPlatform } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ModalLoginPrompt from './modal-login-prompt.jsx';
import AccountWizard from './account-wizard.jsx';
import AddOrManageAccounts from './add-or-manage-accounts.jsx';
import SetCurrency from './set-currency.jsx';
import FinishedSetCurrency from './finished-set-currency.jsx';
import SignupErrorContent from './signup-error-content.jsx';
import StatusDialogContainer from './status-dialog-container.jsx';
import 'Sass/account-wizard.scss';
import 'Sass/real-account-signup.scss';

const WizardHeading = ({ real_account_signup_target, currency, is_isle_of_man_residence, is_belgium_residence }) => {
    if (!currency && real_account_signup_target !== 'maltainvest') {
        return <Localize i18n_default_text='Set a currency for your real account' />;
    }

    if (
        (real_account_signup_target === 'iom' && is_isle_of_man_residence) ||
        (real_account_signup_target === 'malta' && is_belgium_residence)
    ) {
        return <Localize i18n_default_text='Add a Deriv Synthetic account' />;
    }

    switch (real_account_signup_target) {
        case 'malta':
        case 'iom':
            return <Localize i18n_default_text='Add a Deriv Synthetic account' />;
        case 'maltainvest':
            return <Localize i18n_default_text='Add a Deriv Financial account' />;
        default:
            return <Localize i18n_default_text='Add a Deriv account' />;
    }
};

class RealAccountSignup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            is_loading: false,
            modal_content: [
                {
                    body: () => (
                        <AccountWizard
                            onFinishSuccess={this.showStatusDialog}
                            is_loading={this.state.is_loading}
                            setLoading={this.setLoading}
                            onError={this.showErrorModal}
                            onClose={this.closeModal}
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        />
                    ),
                    title: WizardHeading,
                },
                {
                    body: () => (
                        <AddOrManageAccounts
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                            onSuccessAddCurrency={this.showStatusDialog}
                            is_loading={this.state.is_loading}
                            setLoading={this.setLoading}
                            onError={this.showErrorModal}
                        />
                    ),
                    title: () => localize('Add or manage account'),
                },
                {
                    body: () => (
                        <FinishedSetCurrency
                            prev={this.props.state_value.previous_currency}
                            current={this.props.state_value.current_currency}
                            onCancel={this.closeModal}
                            onSubmit={this.closeModalThenOpenCashier}
                        />
                    ),
                },
                {
                    body: () => <StatusDialogContainer />,
                },
                {
                    body: () => (
                        <SetCurrency
                            onLoading={this.showLoadingModal}
                            onError={this.showErrorModal}
                            onClose={this.closeModal}
                            onSuccessSetAccountCurrency={this.showSetCurrencySuccess}
                        />
                    ),
                    title: WizardHeading,
                },
                {
                    body: () => (
                        <SignupErrorContent
                            message={this.props.state_value.error_message}
                            code={this.props.state_value.error_code}
                            onConfirm={this.openPersonalDetails}
                        />
                    ),
                    title: () => localize('Add a real account'),
                },
            ],
        };
    }

    get modal_height() {
        const { currency, has_real_account, is_eu, is_eu_enabled } = this.props; // TODO [deriv-eu] remove is_eu_enabled once eu is released.
        if (this.active_modal_index === 3) return 'auto'; // Status dialog
        if (!currency) return '688px'; // Set currency modal
        if (has_real_account && currency) {
            if (is_eu && is_eu_enabled && this.active_modal_index === 1) {
                // TODO [deriv-eu] remove is_eu_enabled once eu is released.
                // Manage account
                return '400px'; // Since crypto is disabled for EU clients, lower the height of modal
            }
            if (this.active_modal_index === 2) {
                return 'auto';
            }
            return '702px'; // Add or manage account modal
        }
        return '740px'; // Account wizard modal
    }

    showStatusDialog = () => {
        this.props.setParams({
            active_modal_index: 3,
        });
    };

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

    setLoading = is_loading => {
        this.setState({ is_loading });
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
            active_modal_index: 4,
            error_message: error.message,
            error_code: error.code,
        });
    };

    closeModal = e => {
        // Do not close modal on external link click event
        if (e?.target.getAttribute('rel') === 'noopener noreferrer') {
            return;
        }
        if (e?.target.closest('.redirect-notice')) {
            return;
        }
        if (this.active_modal_index !== 3) {
            sessionStorage.removeItem('post_real_account_signup');
            localStorage.removeItem('real_account_signup_wizard');
        }
        this.props.closeRealAccountSignup();

        if (isNavigationFromPlatform(this.props.routing_history, routes.smarttrader)) {
            window.location = routes.smarttrader;
        }
    };

    openPersonalDetails = () => {
        this.props.setParams({
            active_modal_index: 0,
        });
    };

    get is_manage_target() {
        return this.props.real_account_signup_target === 'manage';
    }

    get active_modal_index() {
        const ACCOUNT_WIZARD = 0;
        const ADD_OR_MANAGE_ACCOUNT = 1;
        const SET_CURRENCY = 5;
        if (this.props.state_value.active_modal_index === -1) {
            return this.props.has_real_account && this.props.currency && this.is_manage_target
                ? ADD_OR_MANAGE_ACCOUNT
                : !this.props.currency
                ? SET_CURRENCY
                : ACCOUNT_WIZARD;
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
        const { is_real_acc_signup_on, is_logged_in } = this.props;
        const { title: Title, body: ModalContent } = is_logged_in
            ? this.state.modal_content[this.active_modal_index]
            : {
                  title: this.state.modal_content[this.active_modal_index].title
                      ? () => this.state.modal_content[this.active_modal_index].title
                      : null,
                  body: ModalLoginPrompt,
              };
        const has_close_icon = [0, 1, 5, 6].includes(this.active_modal_index);

        return (
            <>
                <DesktopWrapper>
                    <Modal
                        id='real_account_signup_modal'
                        className={classNames('real-account-signup-modal', {
                            'dc-modal__container_real-account-signup-modal--error': this.active_modal_index === 6,
                            'dc-modal__container_real-account-signup-modal--success':
                                this.active_modal_index >= 2 && this.active_modal_index < 4,
                        })}
                        is_open={is_real_acc_signup_on}
                        has_close_icon={has_close_icon}
                        renderTitle={() => {
                            if (Title) {
                                return <Title {...this.props} />;
                            }
                            return null;
                        }}
                        toggleModal={this.closeModal}
                        height={this.modal_height}
                        width={!has_close_icon ? 'auto' : '904px'}
                    >
                        <ModalContent passthrough={this.props.state_index} is_loading={this.state.is_loading} />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <MobileDialog
                        portal_element_id='modal_root'
                        wrapper_classname='account-signup-mobile-dialog'
                        visible={is_real_acc_signup_on}
                        onClose={this.closeModal}
                        renderTitle={() => {
                            if (Title) {
                                return <Title {...this.props} />;
                            }
                            return null;
                        }}
                    >
                        <ModalContent passthrough={this.props.state_index} is_loading={this.state.is_loading} />
                    </MobileDialog>
                </MobileWrapper>
            </>
        );
    }
}

export default connect(({ ui, client, common }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    has_real_account: client.has_active_real_account,
    currency: client.currency,
    is_eu: client.is_eu,
    is_eu_enabled: ui.is_eu_enabled, // TODO [deriv-eu] remove is_eu_enabled once eu is released.
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    real_account_signup_target: ui.real_account_signup_target,
    is_logged_in: client.is_logged_in,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    closeSignupAndOpenCashier: ui.closeSignupAndOpenCashier,
    setParams: ui.setRealAccountSignupParams,
    residence: client.residence,
    is_isle_of_man_residence: client.residence === 'im', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_belgium_residence: client.residence === 'be', // TODO: [deriv-eu] refactor this once more residence checks are required
    state_value: ui.real_account_signup,
    routing_history: common.app_routing_history,
}))(withRouter(RealAccountSignup));
