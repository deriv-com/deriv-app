import classNames from 'classnames';
import { Field, Formik, Form } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dialog, Loading, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import {
    validPassword,
    getLocation,
    validLength,
    website_name,
    getErrorMessages,
    PlatformContext,
    redirectToSignUp,
} from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import ResidenceForm from '../SetResidenceModal/set-residence-form.jsx';
import 'Sass/app/modules/account-signup.scss';

const signupInitialValues = { password: '', residence: '' };

const validateSignup = (values, residence_list) => {
    const errors = {};

    if (
        !validLength(values.password, {
            min: 8,
            max: 25,
        })
    ) {
        errors.password = localize('You should enter {{min_number}}-{{max_number}} characters.', {
            min_number: 8,
            max_number: 25,
        });
    } else if (!validPassword(values.password)) {
        errors.password = getErrorMessages().password();
    }

    if (!values.residence) {
        errors.residence = true;
    } else {
        const index_of_selection = residence_list.findIndex(
            item => item.text.toLowerCase() === values.residence.toLowerCase()
        );

        if (index_of_selection === -1 || residence_list[index_of_selection].disabled === 'DISABLED') {
            errors.residence = localize('Unfortunately, {{website_name}} is not available in your country.', {
                website_name,
            });
        }
    }

    return errors;
};

const AccountSignup = ({ enableApp, isModalVisible, clients_country, onSignup, residence_list }) => {
    const { is_dashboard } = React.useContext(PlatformContext);
    const [api_error, setApiError] = React.useState(false);
    const [is_loading, setIsLoading] = React.useState(true);
    const [country, setCountry] = React.useState('');
    const [pw_input, setPWInput] = React.useState('');
    const [has_valid_residence, setHasValidResidence] = React.useState(false);

    const updatePassword = new_password => {
        setPWInput(new_password);
    };

    const onResidenceSelection = () => {
        setHasValidResidence(true);
    };

    // didMount lifecycle hook
    React.useEffect(() => {
        WS.wait('website_status', 'residence_list').then(() => {
            if (clients_country && residence_list) {
                setCountry(getLocation(residence_list, clients_country, 'text'));
            }
            setIsLoading(false);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const onSignupComplete = error => {
        if (error) {
            setApiError(error);
        } else {
            isModalVisible(false);
            enableApp();
        }
    };

    const validateSignupPassthrough = values => validateSignup(values, residence_list);
    const onSignupPassthrough = values => {
        const index_of_selection = residence_list.findIndex(
            item => item.text.toLowerCase() === values.residence.toLowerCase()
        );

        const modded_values = {
            ...values,
            residence: residence_list[index_of_selection].value,
        };
        onSignup(modded_values, onSignupComplete);
    };

    return (
        <div className='account-signup'>
            {is_loading ? (
                <Loading is_fullscreen={false} />
            ) : (
                <Formik
                    initialValues={signupInitialValues}
                    validate={validateSignupPassthrough}
                    onSubmit={onSignupPassthrough}
                >
                    {({
                        isSubmitting,
                        handleBlur,
                        errors,
                        handleChange,
                        values,
                        setFieldValue,
                        setFieldTouched,
                        touched,
                    }) => (
                        <Form>
                            {!has_valid_residence ? (
                                <ResidenceForm
                                    header_text={localize('Thanks for verifying your email')}
                                    class_prefix='account-signup'
                                    errors={errors}
                                    touched={touched}
                                    setFieldTouched={setFieldTouched}
                                    setFieldValue={setFieldValue}
                                    residence_list={residence_list}
                                    default_value={country}
                                >
                                    <Button
                                        className={classNames('account-signup__btn', {
                                            'account-signup__btn--disabled': !values.residence || errors.residence,
                                        })}
                                        type='button'
                                        is_disabled={!values.residence || !!errors.residence}
                                        onClick={onResidenceSelection}
                                        primary
                                        text={localize('Next')}
                                    />
                                </ResidenceForm>
                            ) : (
                                <div className='account-signup__password-selection'>
                                    <Text as='p' weight='bold' className='account-signup__heading'>
                                        <Localize i18n_default_text='Keep your account secure with a password' />
                                    </Text>
                                    <Field name='password'>
                                        {({ field }) => (
                                            <PasswordMeter
                                                input={pw_input}
                                                has_error={!!(touched.password && errors.password)}
                                                custom_feedback_messages={getErrorMessages().password_warnings}
                                            >
                                                <PasswordInput
                                                    {...field}
                                                    className='account-signup__password-field'
                                                    label={localize('Create a password')}
                                                    error={touched.password && errors.password}
                                                    required
                                                    value={values.password}
                                                    onBlur={handleBlur}
                                                    onChange={e => {
                                                        const input = e.target;
                                                        setFieldTouched('password', true);
                                                        if (input) updatePassword(input.value);
                                                        handleChange(e);
                                                    }}
                                                />
                                            </PasswordMeter>
                                        )}
                                    </Field>

                                    <Text as='p' size='xxs' className='account-signup__subtext' align='center'>
                                        <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
                                    </Text>

                                    {api_error ? (
                                        <React.Fragment>
                                            <Text
                                                as='p'
                                                size='xxs'
                                                color='loss-danger'
                                                className='account-signup__subtext account-signup__subtext--error'
                                                align='center'
                                            >
                                                {api_error}
                                            </Text>
                                            <div className='account-signup__error-wrapper'>
                                                <Button
                                                    secondary
                                                    text={localize('Cancel')}
                                                    type='button'
                                                    onClick={() => isModalVisible(false)}
                                                />
                                                <Button
                                                    primary
                                                    text={localize('Create new account')}
                                                    type='button'
                                                    onClick={() => redirectToSignUp({ is_dashboard })}
                                                />
                                            </div>
                                        </React.Fragment>
                                    ) : (
                                        <Button
                                            className={classNames('account-signup__btn', {
                                                'account-signup__btn--disabled':
                                                    !values.password || errors.password || isSubmitting,
                                            })}
                                            type='submit'
                                            is_disabled={!values.password || !!errors.password || isSubmitting}
                                            text={localize('Start trading')}
                                            primary
                                        />
                                    )}
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

AccountSignup.propTypes = {
    enableApp: PropTypes.func,
    onSignup: PropTypes.func,
    residence_list: PropTypes.array,
    isModalVisible: PropTypes.func,
};

const AccountSignupModal = ({
    enableApp,
    disableApp,
    clients_country,
    is_loading,
    is_visible,
    is_logged_in,
    logout,
    onSignup,
    residence_list,
    toggleAccountSignupModal,
}) => {
    React.useEffect(() => {
        // a logged in user should not be able to create a new account
        if (is_visible && is_logged_in) {
            logout();
        }
    }, [is_visible, is_logged_in, logout]);

    return (
        <Dialog
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading || !residence_list.length}
            is_mobile_full_width={false}
            is_content_centered
        >
            <AccountSignup
                clients_country={clients_country}
                onSignup={onSignup}
                residence_list={residence_list}
                isModalVisible={toggleAccountSignupModal}
                enableApp={enableApp}
            />
        </Dialog>
    );
};

AccountSignupModal.propTypes = {
    clients_country: PropTypes.string,
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    is_loading: PropTypes.bool,
    is_visible: PropTypes.bool,
    onSignup: PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
};

export default connect(({ ui, client }) => ({
    is_visible: ui.is_account_signup_modal_visible,
    toggleAccountSignupModal: ui.toggleAccountSignupModal,
    enableApp: ui.enableApp,
    disableApp: ui.disableApp,
    is_loading: ui.is_loading,
    onSignup: client.onSignup,
    is_logged_in: client.is_logged_in,
    residence_list: client.residence_list,
    clients_country: client.clients_country,
    logout: client.logout,
}))(AccountSignupModal);
