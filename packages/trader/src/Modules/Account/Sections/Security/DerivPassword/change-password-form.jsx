// import PropTypes        from 'prop-types';
import React        from 'react';
// import { WS }     from 'Services';
import { Formik }   from 'formik';
import {
    Button,
    Label,
    Input }         from 'deriv-components';
import { localize } from 'App/i18n';
import {
    FormBody,
    FormFooter }    from '../../../Components/layout-components.jsx';
import Loading  from '../../../../../templates/app/components/loading.jsx';

const validateFields = values => {
    const errors = {};
    const required_fields = ['old_password', 'new_password'];
    required_fields.forEach(required => {
        if (!values[required]) errors[required] = localize('This field is required');
    });
    if (values.old_password === values.new_password) {
        errors.new_password = localize('Current password and new password cannot be the same.');
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+/.test(values.new_password)) {
        errors.new_password = localize('Password should have lower and uppercase letters with numbers.');
    }
    return errors;
};

class ChangePasswordForm extends React.Component {
    state = {
        is_loading: false,
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
                            <div className='account-management-form-header'>
                                <h1 className='account-management-form-header-text'>
                                    {localize('Change your Deriv password')}
                                </h1>
                            </div>
                            {this.state.is_loading ?
                                <FormBody>
                                    <Loading is_fullscreen={false} className='initial-loader--accounts-modal' />
                                </FormBody>
                                :
                                <FormBody scroll_offset='90px'>
                                    {/** TODO: replace with Input */}
                                    <Label>Current password</Label>
                                    <Input type='password' name='old_password' value={values.old_password} onChange={handleChange} />
                                    {errors.old_password || (touched.old_password && errors.old_password)}

                                    <Label>New password</Label>
                                    <Input type='password' name='new_password' value={values.new_password} onChange={handleChange} />
                                    {errors.new_password || (touched.new_password && errors.new_password)}
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
