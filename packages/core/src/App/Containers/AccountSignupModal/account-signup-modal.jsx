import classNames             from 'classnames';
import {
    Button,
    Dialog,
    PasswordInput }           from 'deriv-components';
import {
    Field,
    Formik,
    Form }                    from 'formik';
import PropTypes              from 'prop-types';
import React                  from 'react';
import { localize, Localize } from 'deriv-translations';
import { connect }            from 'Stores/connect';
import { validPassword }      from 'Utils/Validator/declarative-validation-rules';
import { website_name }       from 'App/Constants/app-config';
import ResidenceForm          from '../SetResidenceModal/set-residence-form.jsx';
import                        'Sass/app/modules/account-signup.scss';

const signupInitialValues = { password: '', residence: '' };

const validateSignup = (values, residence_list) => {
    const errors = {};
    const min_password_length = 6;

    if (values.password && (values.password.length < min_password_length || !validPassword(values.password))) {
        errors.password = true;
    }

    if (!values.residence) {
        errors.residence = true;
    } else {
        const index_of_selection = residence_list.findIndex(item => (
            item.text.toLowerCase() === values.residence.toLowerCase()
        ));

        if (index_of_selection === -1 || residence_list[index_of_selection].disabled === 'DISABLED') {
            errors.residence = localize('Unfortunately, {{website_name}} is not available in your country.', { website_name });
        }
    }

    return errors;
};

class AccountSignup extends React.Component {
    state = {
        has_valid_residence: false,
    };

    onResidenceSelection = () => {
        this.setState({ has_valid_residence: true });
    };

    onSignupComplete = (error) => {
        // Error would be returned on invalid token (and the like) cases.
        // TODO: Proper error handling (currently we have no place to put the message)

        if (error) {
            throw Error(error);
        }

        // Handle lower level modal controls due to overriding modal rendering
        this.props.isModalVisible(false);
        this.props.enableApp();
    };

    render() {
        const { onSignup, residence_list } = this.props;

        const validateSignupPassthrough = (values) => validateSignup(values, residence_list);
        const onSignupPassthrough = (values) => {
            const index_of_selection = residence_list.findIndex(item => (
                item.text.toLowerCase() === values.residence.toLowerCase()
            ));

            const modded_values = { ...values, residence: residence_list[index_of_selection].value };
            onSignup(modded_values, this.onSignupComplete);
        };
        return (
            <div className='account-signup'>
                <Formik
                    initialValues={ signupInitialValues }
                    validate={ validateSignupPassthrough }
                    onSubmit={ onSignupPassthrough }
                >
                    {({ isSubmitting, errors, values, setFieldValue, touched }) => (
                        <Form>
                            <React.Fragment>
                                {
                                    !this.state.has_valid_residence ?
                                        <ResidenceForm
                                            header_text={localize('Thanks for verifying your email')}
                                            class_prefix='account-signup'
                                            errors={errors}
                                            touched={touched}
                                            setFieldValue={setFieldValue}
                                            residence_list={residence_list}
                                        >
                                            <Button
                                                className={classNames('account-signup__btn', { 'account-signup__btn--disabled': !values.residence || errors.residence })}
                                                type='button'
                                                is_disabled={ !values.residence || !!errors.residence }
                                                onClick={this.onResidenceSelection}
                                                primary
                                                text={localize('Next')}
                                            />
                                        </ResidenceForm>
                                        :
                                        <div className='account-signup__password-selection'>
                                            <p className='account-signup__heading'>
                                                <Localize i18n_default_text='Keep your account secure with a password' />
                                            </p>
                                            <Field name='password'>
                                                {({ field }) => (
                                                    <PasswordInput
                                                        { ...field }
                                                        className='account-signup__password-field'
                                                        label={localize('Create a password')}
                                                        error={ touched.password && errors.password }
                                                        required
                                                    />
                                                )}
                                            </Field>
                                            <p className='account-signup__subtext'>
                                                <Localize
                                                    i18n_default_text='Strong passwords contain at least 6 characters, combine uppercase and lowercase letters, numbers, and symbols.'
                                                />
                                            </p>

                                            <Button
                                                className={classNames('account-signup__btn', { 'account-signup__btn--disabled': !values.password || errors.password || isSubmitting })}
                                                type='submit'
                                                is_disabled={ !values.password || !!errors.password || isSubmitting }
                                                text={localize('Start trading')}
                                                primary
                                            />
                                        </div>
                                }
                            </React.Fragment>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

AccountSignup.propTypes = {
    onSignup      : PropTypes.func,
    residence_list: PropTypes.array,
};

const AccountSignupModal = ({
    enableApp,
    disableApp,
    is_loading,
    is_visible,
    onSignup,
    residence_list,
    toggleAccountSignupModal,
}) => {
    return (
        <Dialog
            is_visible={is_visible}
            disableApp={disableApp}
            enableApp={enableApp}
            is_loading={is_loading || !residence_list.length}
            is_content_centered
        >
            <AccountSignup
                onSignup={onSignup}
                residence_list={residence_list}
                isModalVisible={toggleAccountSignupModal}
                enableApp={enableApp}
            />
        </Dialog>
    );
};

AccountSignupModal.propTypes = {
    disableApp    : PropTypes.func,
    enableApp     : PropTypes.func,
    is_loading    : PropTypes.bool,
    is_visible    : PropTypes.bool,
    onSignup      : PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
};

export default connect(
    ({ ui, client }) => ({
        is_visible              : ui.is_account_signup_modal_visible,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        enableApp               : ui.enableApp,
        disableApp              : ui.disableApp,
        is_loading              : ui.is_loading,
        onSignup                : client.onSignup,
        residence_list          : client.residence_list,
    }),
)(AccountSignupModal);
