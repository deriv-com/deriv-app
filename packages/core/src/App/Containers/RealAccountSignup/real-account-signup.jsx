/* eslint-disable react/display-name */
import classNames from 'classnames';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Text, Modal, DesktopWrapper, MobileDialog, MobileWrapper } from '@deriv/components';
import { routes } from '@deriv/shared';
import { RiskToleranceWarningModal, TestWarningModal } from '@deriv/account';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import AccountWizard from './account-wizard.jsx';
import AddCurrency from './add-currency.jsx';
import AddOrManageAccounts from './add-or-manage-accounts.jsx';
import ChooseCurrency from './choose-currency.jsx';
import SetCurrency from './set-currency.jsx';
import FinishedAddCurrency from './finished-add-currency.jsx';
import FinishedSetCurrency from './finished-set-currency.jsx';
import SignupErrorContent from './signup-error-content.jsx';
import StatusDialogContainer from './status-dialog-container.jsx';
import 'Sass/account-wizard.scss';
import 'Sass/real-account-signup.scss';

const modal_pages_indices = {
    account_wizard: 0,
    add_or_manage_account: 1,
    finished_set_currency: 2,
    status_dialog: 3,
    set_currency: 4,
    signup_error: 5,
    choose_crypto_currency: 6,
    add_currency: 7,
    finished_add_currency: 8,
};

const WizardHeading = ({
    country_standpoint,
    currency,
    is_isle_of_man_residence,
    is_pre_appstore,
    real_account_signup_target,
}) => {
    const maltainvest_signup = real_account_signup_target === 'maltainvest';
    const iom_signup = real_account_signup_target === 'iom';
    const deposit_cash_signup = real_account_signup_target === 'deposit_cash';

    if (!maltainvest_signup && !currency) {
        return <Localize i18n_default_text='Set a currency for your real account' />;
    }

    if (deposit_cash_signup) {
        return <Localize i18n_default_text='Add a Deriv Gaming account' />;
    }

    if (iom_signup && is_isle_of_man_residence) {
        return <Localize i18n_default_text='Add a Deriv account' />;
    }

    // if (is_pre_appstore) {
    //     return <Localize i18n_default_text='Get an Options account' />;
    // }

    switch (real_account_signup_target) {
        case 'malta':
            if (
                country_standpoint.is_united_kingdom ||
                country_standpoint.is_rest_of_eu ||
                country_standpoint.is_belgium ||
                is_pre_appstore
            ) {
                return <Localize i18n_default_text='Add a real Deriv Options account' />;
            }
            return <Localize i18n_default_text='Add a Derived account' />;
        case 'iom':
            if (country_standpoint.is_united_kingdom || is_pre_appstore) {
                return <Localize i18n_default_text='Add a real Deriv Gaming account' />;
            }
            return <Localize i18n_default_text='Add a Derived account' />;
        case 'maltainvest':
            if (
                country_standpoint.is_united_kingdom ||
                country_standpoint.is_france ||
                country_standpoint.is_other_eu ||
                country_standpoint.is_rest_of_eu ||
                is_pre_appstore
            ) {
                return <Localize i18n_default_text='Add a real Deriv Multipliers account' />;
            }
            return <Localize i18n_default_text='Add a Deriv Financial account' />;
        case 'samoa':
            return <Localize i18n_default_text='Terms of use' />;
        default:
            return <Localize i18n_default_text='Add a Deriv account' />;
    }
};

const RealAccountSignup = ({
    available_crypto_currencies,
    closeRealAccountSignup,
    continueRoute,
    country_standpoint,
    currency,
    deposit_real_account_signup_target,
    deposit_target,
    fetchAccountSettings,
    has_fiat,
    has_real_account,
    history,
    is_belgium_residence,
    show_eu_related_content,
    is_from_restricted_country,
    is_isle_of_man_residence,
    is_pre_appstore,
    is_real_acc_signup_on,
    real_account_signup_target,
    realAccountSignup,
    replaceCashierMenuOnclick,
    setIsDeposit,
    setIsTradingAssessmentForNewUserEnabled,
    setIsClosingCreateRealAccountModal,
    setParams,
    setShouldShowAppropriatenessWarningModal,
    setShouldShowRiskWarningModal,
    should_show_all_available_currencies,
    should_show_appropriateness_warning_modal,
    should_show_risk_warning_modal,
    state_index,
    state_value,
}) => {
    const [current_action, setCurrentAction] = React.useState(null);
    const [is_loading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [is_risk_warning_visible, setIsRiskWarningVisible] = React.useState(false);
    const [real_account_form_data, setRealAccountFormData] = React.useState({});
    const [risk_warning_title, setRiskWarningTitle] = React.useState('');
    const [modal_content] = React.useState([
        {
            action: 'signup',
            body: local_props => (
                <AccountWizard
                    setIsRiskWarningVisible={setIsRiskWarningVisible}
                    onFinishSuccess={showStatusDialog}
                    onOpenWelcomeModal={closeModalthenOpenWelcomeModal}
                    is_loading={local_props.is_loading}
                    setLoading={setLoading}
                    onError={showErrorModal}
                    onClose={closeModal}
                    realAccountSignup={realAccountSignup}
                    setRealAccountFormData={setRealAccountFormData}
                />
            ),
            title: WizardHeading,
        },
        {
            action: 'multi',
            body: local_props => (
                <AddOrManageAccounts
                    onSuccessSetAccountCurrency={showSetCurrencySuccess}
                    is_loading={local_props.is_loading}
                    setLoading={setLoading}
                    onError={showErrorModal}
                    is_add_crypto={local_props.real_account_signup_target === 'add_crypto'}
                    is_add_fiat={local_props.real_account_signup_target === 'add_fiat'}
                    is_add_currency={local_props.real_account_signup_target === 'add_currency'}
                    deposit_target={local_props.deposit_target}
                    onClose={closeModal}
                />
            ),
            title: local_props => {
                if (local_props.real_account_signup_target === 'add_crypto') {
                    return localize('Create a cryptocurrency account');
                } else if (local_props.real_account_signup_target === 'add_fiat') {
                    return localize('Add a Deriv real account');
                } else if (local_props.real_account_signup_target === 'add_currency') {
                    return localize('Create a new account');
                } else if (local_props.has_fiat && local_props.available_crypto_currencies?.length === 0) {
                    return localize('Manage account');
                }
                return localize('Add or manage account');
            },
        },
        {
            body: local_props => (
                <FinishedSetCurrency
                    prev={local_props.state_value.previous_currency}
                    current={local_props.state_value.current_currency}
                    onCancel={closeSetCurrencySuccessModal}
                    onSubmit={closeModalThenOpenCashier}
                    deposit_real_account_signup_target={local_props.deposit_real_account_signup_target}
                    deposit_target={local_props.deposit_target}
                    closeRealAccountSignup={closeRealAccountSignup}
                    continueRoute={continueRoute}
                    setIsDeposit={setIsDeposit}
                    history={history}
                />
            ),
            title: local_props =>
                local_props.has_fiat && local_props.available_crypto_currencies?.length === 0
                    ? localize('Manage account')
                    : localize('Add or manage account'),
        },
        {
            body: local_props => (
                <StatusDialogContainer
                    currency={local_props.state_value.currency}
                    closeModal={closeSetCurrencySuccessModal}
                />
            ),
        },
        {
            body: local_props => (
                <SetCurrency
                    is_loading={local_props.is_loading}
                    setLoading={setLoading}
                    onError={showErrorModal}
                    onClose={closeModal}
                    onSuccessSetAccountCurrency={showSetCurrencySuccess}
                />
            ),
            title: WizardHeading,
        },
        {
            body: local_props => (
                <SignupErrorContent
                    message={
                        local_props.state_value.error_message || local_props.state_value.error_code?.message_to_client
                    }
                    code={local_props.state_value.error_code}
                    onConfirm={onErrorConfirm}
                />
            ),
            title: () => localize('Add a real account'),
        },
        {
            body: () => <ChooseCurrency className='account-wizard__body' onError={showErrorModal} />,
            title: local_props =>
                local_props.should_show_all_available_currencies
                    ? localize('Choose an account')
                    : localize('Choose a cryptocurrency account'),
        },
        {
            body: () => <AddCurrency className='account-wizard__body' onError={showErrorModal} />,
            title: () => localize('Create a new account'),
        },
        {
            body: local_props => (
                <FinishedAddCurrency
                    prev={local_props.state_value.previous_currency}
                    current={local_props.state_value.current_currency}
                    onSubmit={closeModalThenOpenCashier}
                    deposit_real_account_signup_target={local_props.deposit_real_account_signup_target}
                    deposit_target={local_props.deposit_target}
                    closeRealAccountSignup={closeRealAccountSignup}
                    continueRoute={continueRoute}
                    setIsDeposit={setIsDeposit}
                    history={history}
                />
            ),
        },
    ]);

    const [assessment_decline, setAssessmentDecline] = React.useState(false);

    const getModalHeight = () => {
        if (getActiveModalIndex() === modal_pages_indices.status_dialog) return 'auto';
        if (!currency) return '688px'; // Set currency modal
        if (has_real_account && currency) {
            if (show_eu_related_content && getActiveModalIndex() === modal_pages_indices.add_or_manage_account) {
                // Manage account
                return '420px'; // Since crypto is disabled for EU clients, lower the height of modal
            }
            if (
                [modal_pages_indices.finished_set_currency, modal_pages_indices.finished_add_currency].includes(
                    getActiveModalIndex()
                )
            ) {
                return 'auto';
            }
        }

        return '740px'; // Account wizard modal
    };

    const showStatusDialog = curr => {
        setParams({
            active_modal_index: modal_pages_indices.status_dialog,
            currency: curr,
        });
    };

    const closeModalthenOpenWelcomeModal = curr => {
        closeRealAccountSignup();
        setParams({
            currency: curr,
        });
    };

    const closeModalThenOpenCashier = () => {
        replaceCashierMenuOnclick();
        closeRealAccountSignup();
        history.push(routes.cashier_deposit);
    };

    const showSetCurrencySuccess = (previous_currency, current_currency, target) => {
        setParams({
            previous_currency,
            current_currency,
            active_modal_index: target
                ? modal_pages_indices.finished_add_currency
                : modal_pages_indices.finished_set_currency,
        });
    };

    const setLoading = is_loading_val => {
        setIsLoading(is_loading_val);
    };

    const cacheFormValues = payload => {
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

    const showErrorModal = (err, payload) => {
        if (payload) {
            cacheFormValues(payload);
        }

        setCurrentAction(modal_content[getActiveModalIndex()]?.action);
        setError(err);
    };

    React.useEffect(() => {
        setRiskWarningTitle(localize('Risk Tolerance Warning'));
        return () => setIsTradingAssessmentForNewUserEnabled(false);
    }, []);

    // setCurrentAction callback useEffect to set error details
    React.useEffect(() => {
        if (!error) return;
        setParams({
            active_modal_index: modal_pages_indices.signup_error,
            error_message: error.message,
            error_code: error.code,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error]);

    React.useEffect(() => {
        if (!is_from_restricted_country) return;
        setParams({
            active_modal_index: modal_pages_indices.signup_error,
            error_message: localize('Sorry, account opening is unavailable in your region.'),
            error_code: 'InvalidAccount',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_from_restricted_country, is_real_acc_signup_on]);

    const closeSetCurrencySuccessModal = e => {
        // Do not close modal on external link and popover click event
        if (
            e?.target.getAttribute('rel') === 'noopener noreferrer' ||
            e?.target.closest('.redirect-notice') ||
            e?.target.closest('.dc-popover__bubble')
        ) {
            return;
        }
        if (getActiveModalIndex() !== modal_pages_indices.status_dialog) {
            sessionStorage.removeItem('post_real_account_signup');
            localStorage.removeItem('real_account_signup_wizard');
        }
        closeRealAccountSignup();
    };

    const closeModal = e => {
        // e.nativeEvent.preventDefault();
        replaceCashierMenuOnclick();
        // Do not close modal on external link and popover click event
        if (
            e?.target.getAttribute('rel') === 'noopener noreferrer' ||
            e?.target.closest('.redirect-notice') ||
            e?.target.closest('.dc-popover__bubble')
        ) {
            return;
        }
        if (getActiveModalIndex() !== modal_pages_indices.status_dialog) {
            sessionStorage.removeItem('post_real_account_signup');
            localStorage.removeItem('real_account_signup_wizard');
        }

        if (modal_content[getActiveModalIndex()].action === 'signup') {
            setIsClosingCreateRealAccountModal(true);
            return;
        }
        closeRealAccountSignup();
    };

    const onErrorConfirm = () => {
        setParams({
            active_modal_index:
                current_action === 'multi'
                    ? modal_pages_indices.add_or_manage_account
                    : modal_pages_indices.account_wizard,
        });
    };

    const getIsManageTarget = () => {
        return real_account_signup_target === 'manage';
    };

    const getActiveModalIndex = () => {
        let active_modal_index_no;
        if (real_account_signup_target === 'choose') {
            active_modal_index_no = modal_pages_indices.choose_crypto_currency;
            return active_modal_index_no;
        }
        if (['add_crypto', 'add_fiat', 'add_currency'].includes(real_account_signup_target)) {
            active_modal_index_no = modal_pages_indices.add_or_manage_account;
            return active_modal_index_no;
        }
        if (state_value.active_modal_index === -1) {
            if (has_real_account && currency && getIsManageTarget()) {
                active_modal_index_no = modal_pages_indices.add_or_manage_account;
            } else {
                active_modal_index_no =
                    !currency && real_account_signup_target !== 'maltainvest'
                        ? modal_pages_indices.set_currency
                        : modal_pages_indices.account_wizard;
            }
        } else {
            active_modal_index_no = state_value.active_modal_index;
        }
        return active_modal_index_no;
    };

    // set title and body of the modal
    const { title: Title, body: ModalContent } = modal_content[getActiveModalIndex()];
    const { account_wizard, add_or_manage_account, finished_set_currency, status_dialog, set_currency, signup_error } =
        modal_pages_indices;

    const has_close_icon = [account_wizard, add_or_manage_account, set_currency, signup_error].includes(
        getActiveModalIndex()
    );

    const handleOnAccept = async () => {
        setLoading(true);
        try {
            setShouldShowAppropriatenessWarningModal(false);
            const response = await realAccountSignup({ ...real_account_form_data, accept_risk: 1 });
            if (real_account_signup_target === 'maltainvest') {
                showStatusDialog(response.new_account_maltainvest.currency.toLowerCase());
            }
        } catch (sign_up_error) {
            // TODO: Handle Error
        } finally {
            fetchAccountSettings();
            setLoading(false);
        }
    };

    const handleOnDecline = async () => {
        setLoading(true);
        setAssessmentDecline(true);
        try {
            await realAccountSignup({ ...real_account_form_data, accept_risk: 0 });
        } catch (sign_up_error) {
            setRiskWarningTitle(localize('24-hour Cool Down Warning'));
            if (sign_up_error.code === 'AppropriatenessTestFailed') {
                setShouldShowAppropriatenessWarningModal(false);
                setShouldShowRiskWarningModal(true);
            }
            // TODO: Handle Error case
        } finally {
            fetchAccountSettings();
            setLoading(false);
        }
    };

    const handleRiskAcceptance = () => {
        closeRealAccountSignup();
        setShouldShowRiskWarningModal(false);
        setAssessmentDecline(false);
    };

    if (assessment_decline) {
        return (
            <RiskToleranceWarningModal
                has_icon={false}
                show_risk_modal={assessment_decline}
                onClick={handleRiskAcceptance}
                title={risk_warning_title}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the risk of losing your money. <0/><0/>
                        As you have declined our previous warning, you would need to wait 24 hours before you can proceed further.'
                        components={[<br key={0} />]}
                    />
                }
            />
        );
    } else if (should_show_risk_warning_modal) {
        return (
            <RiskToleranceWarningModal
                has_icon={true}
                show_risk_modal={should_show_risk_warning_modal}
                onClick={handleRiskAcceptance}
                title={risk_warning_title}
                body_content={
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, kindly note that you would need to wait 24 hours before you can proceed further.'
                        components={[<br key={0} />]}
                    />
                }
            />
        );
    } else if (should_show_appropriateness_warning_modal) {
        return (
            <TestWarningModal
                show_risk_modal={should_show_appropriateness_warning_modal}
                body_content={
                    <Text as='p' size='xs'>
                        <Localize
                            i18n_default_text='In providing our services to you, we are required to ask you for some information to assess if a given product or service is appropriate for you and whether you have the experience and knowledge to understand the risks involved.<0/><0/>'
                            components={[<br key={0} />]}
                        />
                        <Localize
                            i18n_default_text='On the basis of the information provided in relation to your knowledge and experience, we consider that the investments available via this website are not appropriate for you.<0/><0/>'
                            components={[<br key={0} />]}
                        />
                        <Localize i18n_default_text='By clicking ‘Accept’ and proceeding with the account opening, you should note that you may be exposing yourself to risks. These risks, which may be significant, include the risk of losing the entire sum invested, and you may not have the knowledge and experience to properly assess or mitigate them.' />
                    </Text>
                }
                footer_content={
                    <React.Fragment>
                        <Button type='button' large text={localize('Decline')} secondary onClick={handleOnDecline} />
                        <Button type='button' large text={localize('Accept')} primary onClick={handleOnAccept} />
                    </React.Fragment>
                }
            />
        );
    }

    return (
        <React.Fragment>
            {is_real_acc_signup_on && (
                <React.Fragment>
                    <DesktopWrapper>
                        <Modal
                            id='real_account_signup_modal'
                            className={classNames('real-account-signup-modal', {
                                'dc-modal__container_real-account-signup-modal--error':
                                    getActiveModalIndex() === signup_error,
                                'dc-modal__container_real-account-signup-modal--success': [
                                    finished_set_currency,
                                    status_dialog,
                                ].includes(getActiveModalIndex()),
                            })}
                            is_open={is_real_acc_signup_on}
                            is_risk_warning_visible={is_risk_warning_visible}
                            has_close_icon={real_account_signup_target !== 'samoa'}
                            is_title_centered={real_account_signup_target === 'samoa'}
                            renderTitle={() => {
                                if (Title && ![finished_set_currency, status_dialog].includes(getActiveModalIndex())) {
                                    return (
                                        <Title
                                            available_crypto_currencies={available_crypto_currencies}
                                            country_standpoint={country_standpoint}
                                            currency={currency}
                                            has_fiat={has_fiat}
                                            is_belgium_residence={is_belgium_residence}
                                            is_eu={show_eu_related_content}
                                            is_isle_of_man_residence={is_isle_of_man_residence}
                                            is_pre_appstore={is_pre_appstore}
                                            real_account_signup_target={real_account_signup_target}
                                            should_show_all_available_currencies={should_show_all_available_currencies}
                                        />
                                    );
                                }

                                return null;
                            }}
                            toggleModal={closeModal}
                            height={getModalHeight()}
                            width={!has_close_icon ? 'auto' : '955px'}
                            elements_to_ignore={[document.querySelector('.modal-root')]}
                        >
                            <ModalContent
                                state_value={state_value}
                                passthrough={state_index}
                                is_loading={is_loading}
                                real_account_signup_target={real_account_signup_target}
                                deposit_real_account_signup_target={deposit_real_account_signup_target}
                                deposit_target={deposit_target}
                            />
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <MobileDialog
                            portal_element_id='modal_root'
                            wrapper_classname='account-signup-mobile-dialog'
                            visible={is_real_acc_signup_on}
                            onClose={closeModal}
                            renderTitle={() => {
                                if (Title) {
                                    return (
                                        <Title
                                            country_standpoint={country_standpoint}
                                            currency={currency}
                                            is_belgium_residence={is_belgium_residence}
                                            is_isle_of_man_residence={is_isle_of_man_residence}
                                            is_pre_appstore={is_pre_appstore}
                                            real_account_signup_target={real_account_signup_target}
                                            should_show_all_available_currencies={should_show_all_available_currencies}
                                        />
                                    );
                                }

                                return null;
                            }}
                        >
                            <ModalContent
                                state_value={state_value}
                                passthrough={state_index}
                                is_loading={is_loading}
                                real_account_signup_target={real_account_signup_target}
                                deposit_real_account_signup_target={deposit_real_account_signup_target}
                                deposit_target={deposit_target}
                            />
                        </MobileDialog>
                    </MobileWrapper>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default connect(({ ui, client, traders_hub, modules }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    cfd_score: client.cfd_score,
    closeRealAccountSignup: ui.closeRealAccountSignup,
    continueRoute: modules.cashier.general_store.continueRoute,
    country_standpoint: client.country_standpoint,
    currency: client.currency,
    deposit_real_account_signup_target: ui.deposit_real_account_signup_target,
    deposit_target: modules.cashier.general_store.deposit_target,
    fetchAccountSettings: client.fetchAccountSettings,
    fetchFinancialAssessment: client.fetchFinancialAssessment,
    has_fiat: client.has_fiat,
    has_real_account: client.has_active_real_account,
    is_belgium_residence: client.residence === 'be', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_from_restricted_country: client.is_from_restricted_country,
    is_isle_of_man_residence: client.residence === 'im', // TODO: [deriv-eu] refactor this once more residence checks are required
    is_pre_appstore: client.is_pre_appstore,
    is_real_acc_signup_on: ui.is_real_acc_signup_on,
    real_account_signup_target: ui.real_account_signup_target,
    realAccountSignup: client.realAccountSignup,
    replaceCashierMenuOnclick: modules.cashier.general_store.replaceCashierMenuOnclick,
    setCFDScore: client.setCFDScore,
    setIsDeposit: modules.cashier.general_store.setIsDeposit,
    setIsTradingAssessmentForNewUserEnabled: ui.setIsTradingAssessmentForNewUserEnabled,
    setIsClosingCreateRealAccountModal: ui.setIsClosingCreateRealAccountModal,
    setParams: ui.setRealAccountSignupParams,
    setShouldShowAppropriatenessWarningModal: ui.setShouldShowAppropriatenessWarningModal,
    setShouldShowRiskWarningModal: ui.setShouldShowRiskWarningModal,
    setShouldShowVerifiedAccount: ui.setShouldShowVerifiedAccount,
    should_show_all_available_currencies: modules.cashier.general_store.should_show_all_available_currencies,
    should_show_appropriateness_warning_modal: ui.should_show_appropriateness_warning_modal,
    should_show_risk_warning_modal: ui.should_show_risk_warning_modal,
    state_value: ui.real_account_signup,
    show_eu_related_content: traders_hub.show_eu_related_content,
}))(withRouter(RealAccountSignup));
