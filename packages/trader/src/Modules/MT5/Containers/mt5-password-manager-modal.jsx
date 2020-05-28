import {
    Icon,
    Modal,
    Tabs,
    PasswordInput,
    PasswordMeter,
    Button,
    DesktopWrapper,
    MobileWrapper,
    MultiStep,
    PageOverlay,
    ThemedScrollbars,
    UILoader,
} from '@deriv/components';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { urlFor } from '@deriv/shared/utils/url';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import MT5Store from 'Stores/Modules/MT5/mt5-store';
import { validLength, validPassword } from 'Utils/Validator/declarative-validation-rules';

// TODO: remove this once MT5 main password reset is supported in Deriv.app
const MT5PasswordResetUnavailable = () => (
    <>
        <p className='mt5-password-manager--paragraph'>
            {localize(
                "We're currently only able to reset your MT5 password on Binary.com. While we fix this, please log in to Binary.com MT5 to reset your password."
            )}
        </p>
        <Button
            className='mt5-password-manager--button'
            has_effect
            text={localize('Take me to Binary.com MT5')}
            onClick={() => window.open(urlFor('user/metatrader', { legacy: true }))}
            primary
            large
        />
    </>
);

const MT5PasswordSuccessMessage = ({ toggleModal, is_investor }) => (
    <div className='mt5-password-manager__success'>
        <Icon icon='IcPasswordUpdated' size={128} />
        <h1 className='mt5-password-manager__success-header'>
            <Localize i18n_default_text='Password changed' />
        </h1>
        <p className='mt5-password-manager__success-paragraph'>
            {is_investor ? (
                <Localize i18n_default_text='Your investor password has been changed.' />
            ) : (
                <Localize i18n_default_text='Your password has been changed.' />
            )}
        </p>
        <Button onClick={toggleModal} className='mt5-password-manager__success-btn' primary large>
            <p className='dc-btn__text'>{localize('OK')}</p>
        </Button>
    </div>
);

class MT5PasswordManagerModal extends React.Component {
    multi_step_ref = React.createRef();
    state = {
        active_tab_index: 0,
        error_message_main: '',
        is_submit_success_main: false,
        error_message_investor: '',
        is_submit_success_investor: false,
    };

    componentDidUpdate(next_props) {
        if (!next_props.is_visible && this.props.is_visible) {
            this.setState({
                active_tab_index: 0,
                error_message_main: '',
                is_submit_success_main: false,
                error_message_investor: '',
                is_submit_success_investor: false,
            });
        }
    }

    showError = (section, error_message) => {
        this.setState({
            [`error_message_${section}`]: error_message,
        });
    };

    hideError = section => {
        this.setState({
            [`error_message_${section}`]: '',
            [`is_submit_success_${section}`]: true,
        });
    };

    updateAccountTabIndex = index => {
        this.setState({
            active_tab_index: index,
            error_message_main: '',
            is_submit_success_main: false,
            error_message_investor: '',
            is_submit_success_investor: false,
        });
    };

    render() {
        const {
            enableApp,
            disableApp,
            is_visible,
            selected_login,
            selected_account,
            selected_type,
            toggleModal,
        } = this.props;

        const validatePassword = values => {
            const errors = {};

            if (
                !validLength(values.new_password, {
                    min: 8,
                    max: 25,
                })
            ) {
                errors.new_password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
                    min_number: 8,
                    max_number: 25,
                });
            } else if (!validPassword(values.new_password)) {
                errors.new_password = localize('You need to include uppercase and lowercase letters, and numbers.');
            }

            if (!values.old_password && values.old_password !== undefined) {
                errors.old_password = localize('This field is required');
            }

            return errors;
        };

        const onSubmit = async values => {
            const login = selected_login;

            if (!login) {
                return;
            }

            const error = await MT5Store.changePassword({ login, ...values });

            if (error) {
                this.showError(values.password_type, error);
            } else {
                this.hideError(values.password_type);
            }
        };

        const MainPasswordManager = () => {
            if (this.state.is_submit_success_main) {
                return <MT5PasswordSuccessMessage toggleModal={toggleModal} />;
            }

            const initial_values = { old_password: '', new_password: '', password_type: 'main' };

            return (
                <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                    {({ isSubmitting, errors, setFieldTouched, touched }) => (
                        <Form className='mt5-password-manager__main-form' noValidate>
                            {this.state.error_message_main && (
                                <p className='mt5-password-manager--error-message'>{this.state.error_message_main}</p>
                            )}
                            <Field name='old_password'>
                                {({ field }) => (
                                    <PasswordInput
                                        {...field}
                                        label={localize('Current password')}
                                        error={touched.old_password && errors.old_password}
                                        required
                                    />
                                )}
                            </Field>
                            <Field name='new_password'>
                                {({ field }) => (
                                    <PasswordMeter
                                        input={field.value}
                                        has_error={!!(touched.new_password && errors.new_password)}
                                    >
                                        {({ has_warning }) => (
                                            <PasswordInput
                                                {...field}
                                                autoComplete='password'
                                                label={localize('New password')}
                                                hint={
                                                    !has_warning &&
                                                    localize(
                                                        'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                                    )
                                                }
                                                error={touched.new_password && errors.new_password}
                                                onChange={e => {
                                                    setFieldTouched('new_password', true, true);
                                                    field.onChange(e);
                                                }}
                                                className='mt5-password-manager__new-password'
                                                required
                                            />
                                        )}
                                    </PasswordMeter>
                                )}
                            </Field>
                            <div className='mt5-password-manager__actions'>
                                <Button
                                    className='mt5-password-manager--button'
                                    is_disabled={isSubmitting}
                                    is_loading={isSubmitting}
                                    text={localize('Change password')}
                                    primary
                                    large
                                />
                                <Button
                                    className='mt5-password-manager--button'
                                    type='button'
                                    onClick={() => this.multi_step_ref.current?.nextStep()}
                                    text={localize('Reset main password')}
                                    tertiary
                                    large
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            );
        };

        const InvestorPasswordManager = () => {
            if (this.state.is_submit_success_investor) {
                return <MT5PasswordSuccessMessage toggleModal={toggleModal} is_investor />;
            }

            const initial_values = { old_password: '', new_password: '', password_type: 'investor' };

            return (
                <div className='mt5-password-manager__investor-wrapper'>
                    <p className='mt5-password-manager--paragraph'>
                        <Localize i18n_default_text='Use this password to grant viewing access to another user. While they may view your trading account, they will not be able to trade or take any other actions.' />
                    </p>
                    <p className='mt5-password-manager--paragraph'>
                        <Localize i18n_default_text='If this is the first time you try to create a password, or you have forgotten your password, please reset it.' />
                    </p>
                    {this.state.error_message_investor && (
                        <p className='mt5-password-manager--error-message'>{this.state.error_message_investor}</p>
                    )}
                    <Formik initialValues={initial_values} validate={validatePassword} onSubmit={onSubmit}>
                        {({ isSubmitting, errors, setFieldTouched, touched }) => (
                            <Form className='mt5-password-manager__investor-form' noValidate>
                                <Field name='old_password'>
                                    {({ field }) => (
                                        <PasswordInput
                                            {...field}
                                            label={localize('Current investor password')}
                                            error={touched.old_password && errors.old_password}
                                            required
                                        />
                                    )}
                                </Field>
                                <Field name='new_password'>
                                    {({ field }) => (
                                        <PasswordMeter
                                            input={field.value}
                                            has_error={!!(touched.new_password && errors.new_password)}
                                        >
                                            {({ has_warning }) => (
                                                <PasswordInput
                                                    {...field}
                                                    autoComplete='password'
                                                    label={localize('New investor password')}
                                                    hint={
                                                        !has_warning &&
                                                        localize(
                                                            'Strong passwords contain at least 8 characters, combine uppercase and lowercase letters and numbers.'
                                                        )
                                                    }
                                                    error={touched.new_password && errors.new_password}
                                                    onChange={e => {
                                                        setFieldTouched('new_password', true, true);
                                                        field.onChange(e);
                                                    }}
                                                    className='mt5-password-manager__new-password'
                                                    required
                                                />
                                            )}
                                        </PasswordMeter>
                                    )}
                                </Field>
                                <div className='mt5-password-manager__actions'>
                                    <Button
                                        className='mt5-password-manager--button'
                                        is_disabled={isSubmitting}
                                        is_loading={isSubmitting}
                                        text={localize('Change investor password')}
                                        primary
                                        large
                                    />
                                    <Button
                                        className='mt5-password-manager--button'
                                        type='button'
                                        onClick={() => this.multi_step_ref.current?.nextStep()}
                                        text={localize('Create or reset investor password')}
                                        tertiary
                                        large
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            );
        };

        // view height - margin top and bottom of modal - modal title - modal content margin top and bottom - table title
        const password_container_height = 'calc(100vh - 84px - 5.6rem - 8.8rem - 4rem)';

        const MT5PasswordManagerTabContent = () => (
            <>
                <Tabs active_index={this.state.active_tab_index} onTabItemClick={this.updateAccountTabIndex} top>
                    <div label={localize('Main password')}>
                        <DesktopWrapper>
                            <ThemedScrollbars style={{ height: password_container_height }}>
                                <MainPasswordManager />
                            </ThemedScrollbars>
                        </DesktopWrapper>
                        <MobileWrapper>
                            <ThemedScrollbars autoHide style={{ height: 'calc(100vh - 120px)' }}>
                                <MainPasswordManager />
                            </ThemedScrollbars>
                        </MobileWrapper>
                    </div>
                    <div label={localize('Investor password')}>
                        <DesktopWrapper>
                            <ThemedScrollbars style={{ height: password_container_height }}>
                                <InvestorPasswordManager />
                            </ThemedScrollbars>
                        </DesktopWrapper>
                        <MobileWrapper>
                            <ThemedScrollbars autoHide style={{ height: 'calc(100vh - 120px)' }}>
                                <InvestorPasswordManager />
                            </ThemedScrollbars>
                        </MobileWrapper>
                    </div>
                </Tabs>
            </>
        );

        const steps = [
            {
                component: <MT5PasswordManagerTabContent />,
            },
            {
                component: <MT5PasswordResetUnavailable />,
            },
        ];

        const MT5PasswordManagerTabContentWrapper = () => (
            <MultiStep
                ref={this.multi_step_ref}
                steps={steps}
                className='mt5-password-manager'
                lbl_previous={localize('Back')}
            />
        );

        return (
            <React.Suspense fallback={<UILoader />}>
                <DesktopWrapper>
                    <Modal
                        className='mt5-password-manager__modal'
                        disableApp={disableApp}
                        enableApp={enableApp}
                        is_open={is_visible}
                        title={
                            selected_type === 'real'
                                ? localize('Manage DMT5 Real {{account_title}} account password', {
                                      account_title: selected_account,
                                  })
                                : localize('Manage DMT5 Demo {{account_title}} account password', {
                                      account_title: selected_account,
                                  })
                        }
                        toggleModal={toggleModal}
                        height='688px'
                        width='904px'
                    >
                        <MT5PasswordManagerTabContentWrapper />
                    </Modal>
                </DesktopWrapper>
                <MobileWrapper>
                    <PageOverlay
                        is_open={is_visible}
                        portal_id='deriv_app'
                        header={localize('Manage password')}
                        onClickClose={toggleModal}
                    >
                        <MT5PasswordManagerTabContentWrapper />
                    </PageOverlay>
                </MobileWrapper>
            </React.Suspense>
        );
    }
}

MT5PasswordManagerModal.propTypes = {
    is_visible: PropTypes.bool,
    selected_account: PropTypes.string,
    selected_login: PropTypes.string,
    toggleModal: PropTypes.func,
};

export default connect(({ ui }) => ({
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
}))(MT5PasswordManagerModal);
