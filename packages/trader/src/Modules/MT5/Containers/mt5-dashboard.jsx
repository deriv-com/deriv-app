import {
    Button,
    Tabs,
    Modal,
    Input,
    PasswordMeter }              from 'deriv-components';
import {
    Field,
    Formik,
    Form }                       from 'formik';
import React                     from 'react';
import Localize                  from 'App/Components/Elements/localize.jsx';
import UILoader                  from 'App/Components/Elements/ui-loader.jsx';
import { localize }              from 'App/i18n';
import IconDeviceLaptop          from 'Assets/SvgComponents/mt5/download-center/icon-device-laptop.svg';
import IconDeviceMac             from 'Assets/SvgComponents/mt5/download-center/icon-device-mac.svg';
import IconDeviceMobile          from 'Assets/SvgComponents/mt5/download-center/icon-device-mobile.svg';
import IconInstallationApple     from 'Assets/SvgComponents/mt5/download-center/icon-installation-apple.svg';
import IconInstallationGoogle    from 'Assets/SvgComponents/mt5/download-center/icon-installation-google.svg';
import IconInstallationLinux     from 'Assets/SvgComponents/mt5/download-center/icon-installation-linux.svg';
import IconInstallationMac       from 'Assets/SvgComponents/mt5/download-center/icon-installation-mac.svg';
import IconInstallationWindows   from 'Assets/SvgComponents/mt5/download-center/icon-installation-windows.svg';
import MT5PasswordModal          from 'Modules/MT5/Containers/mt5-password-modal.jsx';
import Mt5TopUpDemoModal         from 'Modules/MT5/Containers/mt5-top-up-demo-modal.jsx';
import { connect }               from 'Stores/connect';
import {
    validLength,
    validPassword }              from 'Utils/Validator/declarative-validation-rules';
import CompareAccountsModal      from './mt5-compare-accounts-modal.jsx';
import { MT5DemoAccountDisplay } from '../Components/mt5-demo-account-display.jsx';
import { MT5RealAccountDisplay } from '../Components/mt5-real-account-display.jsx';
import 'Sass/app/modules/mt5/mt5-dashboard.scss';

class MT5Dashboard extends React.Component {
    state = {
        password_manager: {
            is_visible    : false,
            selected_login: '',
        },
        // error_message_main: '',
        // error_message_investor: '',
        main: {
            has_error    : false,
            error_message: '',
        },
        investor: {
            has_error    : false,
            error_message: '',
        },
    };

    openAccountTransfer = (data, meta) => {
        if (meta.category === 'real') {
            this.props.toggleAccountTransferModal();
        } else {
            this.props.setCurrentAccount(data, meta);
            this.props.openTopUpModal();
        }
    };

    togglePasswordManagerModal = (login) => {
        this.setState((prev_state) => ({
            password_manager: {
                is_visible    : !prev_state.password_manager.is_visible,
                selected_login: login || '',
            },
        }));
    };

    showError = (section, error_message) => {
        this.setState({
            [section]: {
                has_error: true,
                error_message,
            },
        });
    };

    hideError = (section) => {
        this.setState({
            [section]: {
                has_error    : false,
                error_message: '',
            },
        });
    };

    render() {
        const {
            beginRealSignupForMt5,
            createMT5Account,
            disableApp,
            enableApp,
            is_loading,
            has_mt5_account,
            has_real_account,
            onSubmitPasswordChange,
        } = this.props;

        const validatePassword = (values) => {
            const is_valid = validPassword(values.new_password) &&
                validLength(values.new_password, {
                    min: 8,
                    max: 25,
                });
            const errors = {};

            if (!is_valid) {
                errors.new_password = localize('You need to include uppercase and lowercase letters, and numbers.');
            }

            if (!values.old_password && values.old_password !== undefined) {
                errors.old_password = localize('This field is required');
            }

            return errors;
        };
        const onSubmit = async (values) => {
            if (!this.state.password_manager.selected_login) {
                return;
            }

            const error = await onSubmitPasswordChange(
                { login: this.state.password_manager.selected_login, ...values }
            );

            if (error) {
                this.showError(values.password_type, error);
            } else {
                this.hideError(values.password_type);
            }
        };

        const MainPasswordManager = () => {
            const initial_values = { old_password: '', new_password: '', password_type: 'main' };

            return (
                <Formik
                    initialValues={ initial_values }
                    validate={ validatePassword }
                    onSubmit={ onSubmit }
                >
                    {({ isSubmitting, errors, setFieldTouched, touched }) => (
                        <Form className='mt5-password-manager__main-form' noValidate>
                            { this.state.main.has_error &&
                                <p className='mt5-password-manager--error-message'>
                                    { this.state.main.error_message }
                                </p>
                            }
                            <Field name='old_password'>
                                {({ field }) => (
                                    <Input
                                        { ...field }
                                        type='password'
                                        label={localize('Current password')}
                                        error={ touched.old_password && errors.old_password }
                                        required
                                    />
                                )}
                            </Field>
                            <Field name='new_password'>
                                {({ field }) => (
                                    <PasswordMeter
                                        input={field.value}
                                        error={touched.new_password && errors.new_password}
                                    >
                                        <Input
                                            { ...field }
                                            autoComplete='password'
                                            label={localize('New password')}
                                            type='password'
                                            onChange={(e) => {
                                                setFieldTouched('new_password', true, true);
                                                field.onChange(e);
                                            }}
                                            required
                                        />
                                    </PasswordMeter>
                                )}
                            </Field>
                            <p className='mt5-password-manager--hint'><Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' /></p>
                            <div className='mt5-password-manager__actions'>
                                <Button className='mt5-password-manager--button btn--primary--default' is_disabled={ isSubmitting }>
                                    <span className='btn__text'><Localize i18n_default_text='Change password' /></span>
                                </Button>
                                <Button className='mt5-password-manager--button btn--tertiary--default' type='button'>
                                    <span className='btn__text'><Localize i18n_default_text='Reset main password' /></span>
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            );
        };

        const InvestorPasswordManager = () => {
            const initial_values = { old_password: '', new_password: '', password_type: 'investor' };

            return (
                <div className='mt5-password-manager__investor-wrapper'>
                    <p className='mt5-password-manager--paragraph'>
                        <Localize i18n_default_text='Use this password to allow another user to access your account to view your trades. This user will not be able to trade or take any other actions.' />
                    </p>
                    { this.state.investor.has_error &&
                        <p className='mt5-password-manager--error-message'>
                            { this.state.investor.error_message }
                        </p>
                    }
                    <Formik
                        initialValues={ initial_values }
                        validate={ validatePassword }
                        onSubmit={ onSubmit }
                    >
                        {({ isSubmitting, errors, setFieldTouched, touched }) => (
                            <Form className='mt5-password-manager__investor-form' noValidate>
                                <Field name='old_password'>
                                    {({ field }) => (
                                        <Input
                                            { ...field }
                                            type='password'
                                            label={localize('Current investor password')}
                                            error={ touched.old_password && errors.old_password }
                                            required
                                        />
                                    )}
                                </Field>
                                <Field name='new_password'>
                                    {({ field }) => (
                                        <PasswordMeter
                                            input={field.value}
                                            error={touched.new_password && errors.new_password}
                                        >
                                            <Input
                                                { ...field }
                                                autoComplete='password'
                                                label={localize('New investor password')}
                                                type='password'
                                                onChange={(e) => {
                                                    setFieldTouched('new_password', true, true);
                                                    field.onChange(e);
                                                }}
                                                required
                                            />
                                        </PasswordMeter>
                                    )}
                                </Field>
                                <p className='mt5-password-manager--hint'><Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.' /></p>
                                <div className='mt5-password-manager__actions'>
                                    <Button className='mt5-password-manager--button btn--primary--default' is_disabled={ isSubmitting }>
                                        <span className='btn__text'><Localize i18n_default_text='Change investor password' /></span>
                                    </Button>
                                    <Button className='mt5-password-manager--button btn--tertiary--default' type='button'>
                                        <span className='btn__text'><Localize i18n_default_text='Create or reset investor password' /></span>
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            );
        };

        const PasswordManagerModal = () => (
            <React.Suspense fallback={<UILoader />}>
                <Modal
                    className='mt5-password-manager__modal'
                    disableApp={disableApp}
                    enableApp={enableApp}
                    is_open={this.state.password_manager.is_visible}
                    title={localize('Manage your DMT5 Standard real account password')}
                    toggleModal={this.togglePasswordManagerModal}
                >
                    <div className='mt5-password-manager'>
                        <Tabs>
                            <div label={localize('Main password')}>
                                <MainPasswordManager />
                            </div>
                            <div label={localize('Investor password')}>
                                <InvestorPasswordManager />
                            </div>
                        </Tabs>
                    </div>
                </Modal>
            </React.Suspense>
        );

        return (
            <div className='mt5-dashboard'>
                { !has_mt5_account &&
                    <div className='mt5-dashboard__welcome-message'>
                        <h1 className='mt5-dashboard__welcome-message--heading'>
                            <Localize i18n_default_text='Welcome to your DMT5 account dashboard and manager' />
                        </h1>
                        <div className='mt5-dashboard__welcome-message--content'>
                            <p className='mt5-dashboard__welcome-message--paragraph'>
                                <Localize
                                    i18n_default_text='MetaTrader 5 (MT5) is a popular online trading platform for forex and stock markets. Get prices and currency quotes, perform analysis using charts and technical indicators, and easily view your trading history.'
                                />
                            </p>
                        </div>
                    </div>
                }
                { !has_real_account &&
                    <div className='mt5-dashboard__missing-real'>
                        <h1 className='mt5-dashboard__missing-real--heading'>
                            <Localize i18n_default_text='You need a real account (fiat currency or cryptocurrency) in Deriv to get started with DMT5.' />
                        </h1>
                        <Button
                            className='btn--primary--default mt5-dashboard__missing-real--button'
                            onClick={ beginRealSignupForMt5 }
                            type='button'
                        >
                            <span className='btn__text'><Localize i18n_default_text='Create a Deriv account' /></span>
                        </Button>
                    </div>
                }

                <div className='mt5-dashboard__accounts-display'>
                    <PasswordManagerModal />
                    <Tabs>
                        <div label={localize('Real account')}>
                            <MT5RealAccountDisplay
                                is_loading={ is_loading }
                                current_list={this.props.current_list}
                                has_mt5_account={has_mt5_account}
                                onSelectAccount={createMT5Account}
                                openAccountTransfer={this.openAccountTransfer}
                                openPasswordManager={ this.togglePasswordManagerModal }
                            />
                        </div>
                        <div label={localize('Demo account')}>
                            <MT5DemoAccountDisplay
                                is_loading={ is_loading }
                                has_mt5_account={has_mt5_account}
                                current_list={this.props.current_list}
                                onSelectAccount={createMT5Account}
                                openAccountTransfer={this.openAccountTransfer}
                                openPasswordManager={ this.togglePasswordManagerModal }
                            />
                        </div>
                    </Tabs>
                    <CompareAccountsModal />
                </div>

                <div className='mt5-dashboard__download-center'>
                    <h1 className='mt5-dashboard__download-center--heading'>
                        <Localize
                            i18n_default_text='Download MT5 for your desktop or mobile'
                        />
                    </h1>

                    <div className='mt5-dashboard__download-center-options'>
                        <div className='mt5-dashboard__download-center-options--desktop'>
                            <div className='mt5-dashboard__download-center-options--desktop-devices'>
                                <IconDeviceMac />
                                <IconDeviceLaptop />
                            </div>
                            <div className='mt5-dashboard__download-center-options--desktop-links'>
                                <a href='https://s3.amazonaws.com/binary-mt5/binarycom_mt5.exe' target='_blank' rel='noopener noreferrer'><IconInstallationWindows /></a>
                                <a href='https://deriv.s3-ap-southeast-1.amazonaws.com/deriv-mt5.dmg' target='_blank' rel='noopener noreferrer'><IconInstallationMac /></a>
                                <a href='https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux' target='_blank' rel='noopener noreferrer'><IconInstallationLinux /></a>
                            </div>
                        </div>
                        <div className='mt5-dashboard__download-center-options--mobile'>
                            <div className='mt5-dashboard__download-center-options--mobile-devices'>
                                <IconDeviceMobile />
                            </div>
                            <div className='mt5-dashboard__download-center-options--mobile-links'>
                                <a href='https://download.mql5.com/cdn/mobile/mt5/ios?server=Binary.com-Server' target='_blank' rel='noopener noreferrer'><IconInstallationApple /></a>
                                <a href='https://download.mql5.com/cdn/mobile/mt5/android?server=Binary.com-Server' target='_blank' rel='noopener noreferrer'><IconInstallationGoogle /></a>
                            </div>
                        </div>
                    </div>
                    <p className='mt5-dashboard__download-center--hint'>
                        <Localize
                            i18n_default_text='The MT5 platform does not support Windows XP, Windows 2003 and Windows Vista.'
                        />
                    </p>
                </div>
                <Mt5TopUpDemoModal />
                <MT5PasswordModal />
            </div>
        );
    }
}

export default connect(({ client, modules, ui }) => ({
    beginRealSignupForMt5      : modules.mt5.beginRealSignupForMt5,
    createMT5Account           : modules.mt5.createMT5Account,
    disableApp                 : ui.disableApp,
    enableApp                  : ui.enableApp,
    current_list               : modules.mt5.current_list,
    is_compare_accounts_visible: modules.mt5.is_compare_accounts_visible,
    is_loading                 : client.is_populating_mt5_account_list,
    has_mt5_account            : modules.mt5.has_mt5_account,
    has_real_account           : client.has_real_account,
    setCurrentAccount          : modules.mt5.setCurrentAccount,
    toggleCompareAccounts      : modules.mt5.toggleCompareAccountsModal,
    toggleAccountTransferModal : modules.mt5.toggleAccountTransferModal,
    onSubmitPasswordChange     : modules.mt5.changePassword,
    openTopUpModal             : ui.openTopUpModal,
}))(MT5Dashboard);
