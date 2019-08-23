import classNames        from 'classnames';
import React             from 'react';
import PropTypes         from 'prop-types';
import {
    Autocomplete,
    Input,
    Form,
    Button }             from 'deriv-components';
import FullPageModal     from 'App/Components/Elements/FullPageModal/full-page-modal.jsx';
import Localize          from 'App/Components/Elements/localize.jsx';
import { localize }      from 'App/i18n';
import { connect }       from 'Stores/connect';
import { validPassword } from 'Utils/Validator/declarative-validation-rules';
import 'Sass/app/modules/account-signup.scss';

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

        if (index_of_selection > -1) {
            if (residence_list[index_of_selection].disabled === 'DISABLED') {
                errors.residence = localize('Unfortunately, Deriv is not available in your country.');
            }
        } else {
            errors.residence = localize('Unfortunately, Deriv is not available in your country.');
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
                <Form
                    initialValues={ signupInitialValues }
                    validate={ validateSignupPassthrough }
                    onSubmit={ onSignupPassthrough }
                >
                    {
                        ({ isSubmitting, errors, values }) => (
                            <React.Fragment>
                                {
                                    !this.state.has_valid_residence ?
                                        <div className='account-signup__residence-selection'>
                                            <p className='account-signup__heading'>
                                                <Localize i18n_default_text='Thanks for verifying your email' />
                                            </p>
                                            <p className='account-signup__text'>
                                                <Localize i18n_default_text='Where are you a resident?' />
                                            </p>
                                            <Autocomplete
                                                className='account-signup__residence-field'
                                                type='text'
                                                name='residence'
                                                label={ localize('Choose country') }
                                                required
                                                list_items={ residence_list }
                                            />
                                            <p className='account-signup__subtext'>
                                                <Localize
                                                    i18n_default_text='We need this to make sure our service complies with laws and regulations in your country.'
                                                />
                                            </p>

                                            <Button
                                                className={classNames('account-signup__btn', { 'account-signup__btn--disabled': !values.residence || errors.residence })}
                                                type='button'
                                                is_disabled={ !values.residence || errors.residence }
                                                onClick={this.onResidenceSelection}
                                            >
                                                <Localize i18n_default_text='Next' />
                                            </Button>
                                        </div>
                                        :
                                        <div className='account-signup__password-selection'>
                                            <p className='account-signup__heading'>
                                                <Localize i18n_default_text='Keep your account secure with a password' />
                                            </p>
                                            <Input
                                                className='account-signup__password-field'
                                                type='password'
                                                name='password'
                                                label={localize('Create a password')}
                                                required
                                            />
                                            <p className='account-signup__subtext'>
                                                <Localize
                                                    i18n_default_text='Strong passwords contain at least 6 characters, combine uppercase and lowercase letters, numbers, and symbols.'
                                                />
                                            </p>

                                            <Button
                                                className={classNames('account-signup__btn', { 'account-signup__btn--disabled': !values.password || errors.password || isSubmitting })}
                                                type='submit'
                                                is_disabled={ !values.password || errors.password || isSubmitting }
                                            >
                                                <Localize i18n_default_text='Start trading' />
                                            </Button>
                                        </div>
                                }
                            </React.Fragment>
                        )
                    }
                </Form>
            </div>
        );
    }
}

AccountSignup.propTypes = {
    onSignup      : PropTypes.func,
    residence_list: PropTypes.array,
};

const AccountSignupModal = ({ is_visible, onSignup, residence_list, toggleAccountSignupModal, enableApp }) => {
    return (
        <FullPageModal is_visible={is_visible}>
            <AccountSignup
                onSignup={onSignup}
                residence_list={residence_list}
                isModalVisible={toggleAccountSignupModal}
                enableApp={enableApp}
            />
        </FullPageModal>
    );
};

AccountSignupModal.propTypes = {
    is_visible    : PropTypes.bool,
    onSignup      : PropTypes.func,
    residence_list: PropTypes.arrayOf(PropTypes.object),
};

export default connect(
    ({ ui, client }) => ({
        is_visible              : ui.is_account_signup_modal_visible,
        toggleAccountSignupModal: ui.toggleAccountSignupModal,
        enableApp               : ui.enableApp,
        onSignup                : client.onSignup,
        residence_list          : client.residence_list,
    }),
)(AccountSignupModal);
