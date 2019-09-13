// import PropTypes from 'prop-types';
import React        from 'react';
// import { WS }    from 'Services';
import { Formik }   from 'formik';
import {
    Button,
    Input,
    PasswordMeter } from 'deriv-components';
import { localize } from 'App/i18n';
import {
    FormSubHeader,
    FormBody,
    FormFooter }    from '../../../Components/layout-components.jsx';
import Loading      from '../../../../../templates/app/components/loading.jsx';

const validateFields = values => {
    const errors = {};
    const required_fields = ['old_password', 'new_password'];
    required_fields.forEach(required => {
        if (!values[required]) errors[required] = localize('This field is required');
    });
    if (values.old_password === values.new_password) {
        errors.new_password = localize('Current password and new password cannot be the same.');
    }
    if (!/^[ -~]{6,25}$/.test(values.new_password)) {
        errors.new_password = localize('Password length should be between 6 to 25 characters.');
    }
    return errors;
};

class ChangePasswordForm extends React.PureComponent {
    state = {
        is_loading  : false,
        new_pw_input: '',
    }

    updateNewPassword = (string) => {
        this.setState({ new_pw_input: string });
    }

    onSubmit = values => {
        console.log('on_submit: ', values);
    }

    render() {
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        old_password: '',
                        new_password: '',
                    }}
                    validate={validateFields}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        validateField,
                    }) => (
                        <form className='account-management-form' onSubmit={handleSubmit}>
                            {this.state.is_loading ?
                                <FormBody>
                                    <Loading is_fullscreen={false} className='initial-loader--accounts-modal' />
                                </FormBody>
                                :
                                <FormBody scroll_offset='55px'>
                                    <FormSubHeader title={localize('Change your Deriv password')} />
                                    <div className='account-management__password-content'>
                                        <Input
                                            label={localize('Current password')}
                                            classNameError='account-management__password-input--error'
                                            error={errors.old_password || (touched.old_password && errors.old_password)}
                                            type='password'
                                            name='old_password'
                                            value={values.old_password}
                                            onChange={handleChange}
                                        />
                                        <PasswordMeter
                                            input={this.state.new_pw_input}
                                            error={errors.new_password || (touched.new_password && errors.new_password)}
                                        >
                                            <Input
                                                label={localize('New password')}
                                                type='password'
                                                name='new_password'
                                                value={values.new_password}
                                                onChange={(e) => {
                                                    const input = e.target;
                                                    if (input) this.updateNewPassword(input.value);
                                                    handleChange(e);
                                                }}
                                            />
                                        </PasswordMeter>
                                    </div>
                                </FormBody>
                            }
                            <FormFooter>
                                <Button
                                    className='btn--secondary'
                                    type='button'
                                    onClick={this.props.onClickSendEmail}
                                    text={localize('Forgot your password?')}
                                />
                                <Button
                                    className='btn--primary'
                                    type='submit'
                                    disabled={isSubmitting}
                                    has_effect
                                    text={localize('Submit')}
                                />
                            </FormFooter>
                        </form>
                    )}
                </Formik>
            </React.Fragment>
        );
    }
}

// ChangePasswordForm.propTypes = {};

export default ChangePasswordForm;
