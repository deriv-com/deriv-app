import {
    Modal,
    Input,
}                                            from 'deriv-components';
import { Formik }                            from 'formik';
import PropTypes                             from 'prop-types';
import React, { Component }                  from 'react';
import { connect }                           from 'Stores/connect';
import Localize                              from 'App/Components/Elements/localize.jsx';
import FormSubmitButton                      from 'App/Containers/RealAccountSignup/form-submit-button.jsx';
import { validPassword }                     from 'Utils/Validator/declarative-validation-rules';
import 'Sass/mt5.scss';

class Password extends Component {
    validatePassword = (values) => validPassword(values.password);

    render() {
        return (
            <Modal
                className='mt5-password-modal'
                is_open={this.props.is_mt5_password_modal_enabled}
                has_close_icon={false}
            >
                <Formik
                    initialValues={{
                        password: '',
                    }}
                    validate={this.validatePassword}
                    onSubmit={(values, actions) => {
                        this.props.submitMt5Password(
                            values.password,
                            actions.setSubmitting
                        );
                    }}
                    render={({
                        handleSubmit,
                        // setFieldValue,
                        // setFieldTouched,
                        errors,
                        values,
                        isSubmitting,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <h1>
                                <Localize
                                    i18n_default_text='Choose a password for your DMT5 {{ account_type }}'
                                    values={{
                                        account_type: this.props.account_title,
                                    }}
                                />
                            </h1>
                            <div className='dc-modal__container_mt5-password-modal__body'>
                                <Input
                                    className='mt5-password-field'
                                    name='password'
                                    id='mt5_password_field'
                                    type='password'
                                />
                                <p>
                                    <Localize
                                        i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters with numbers'
                                    />
                                </p>
                            </div>
                            <FormSubmitButton
                                is_disabled={
                                    isSubmitting ||
                                    !values.password ||
                                    Object.keys(errors).length > 0
                                }
                                label='Next' // Localization will be handled by component
                                is_absolute={true}
                                form_error={this.props.form_error}
                            />
                        </form>
                    )}
                />
            </Modal>
        );
    }
}

Password.propTypes = {
    account_title                : PropTypes.string,
    is_mt5_password_modal_enabled: PropTypes.bool,
};
export default connect(({ ui, modules }) => ({
    is_mt5_password_modal_enabled: ui.is_mt5_password_modal_enabled,
    account_title                : modules.mt5.account_title,
}))(Password);
