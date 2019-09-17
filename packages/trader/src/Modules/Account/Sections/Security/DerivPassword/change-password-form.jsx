// import PropTypes from 'prop-types';
import React        from 'react';
import { Formik }   from 'formik';
import {
    Button,
    Input,
    PasswordMeter } from 'deriv-components';
import { WS }       from 'Services';
import { localize } from 'App/i18n';
import FormSubmitErrorMessage from '../../ErrorMessages/FormSubmitErrorMessage';
import ButtonLoading from '../../../Components/button-loading.jsx';
import {
    FormSubHeader,
    FormBody,
    FormFooter }    from '../../../Components/layout-components.jsx';
import Loading      from '../../../../../templates/app/components/loading.jsx';

class ChangePasswordForm extends React.PureComponent {
    state = {
        is_loading  : false,
        new_pw_input: '',
    }

    updateNewPassword = (string) => {
        this.setState({ new_pw_input: string });
    }

    onSubmit = (values, { setSubmitting, setStatus })  => {
        setStatus({ msg: '' });
        this.setState({ is_btn_loading: true });
        WS.authorized.storage.changePassword(values).then((data) => {
            this.setState({ is_btn_loading: false });
            if (data.error) {
                setStatus({ msg: data.error.message });
            } else {
                this.setState({ is_submit_success: true });
            }
            setSubmitting(false);
        });
    }

    validateFields = values => {
        this.setState({ is_submit_success: false });
        const errors = {};

        const required_fields = ['old_password', 'new_password'];
        required_fields.forEach(required => {
            if (!values[required]) errors[required] = localize('This field is required');
        });

        if (values.new_password) {
            if (!/^[ -~]{6,25}$/.test(values.new_password)) {
                errors.new_password = localize('Password length should be between 6 to 25 characters.');
            }
            if (values.old_password === values.new_password) {
                errors.new_password = localize('Current password and new password cannot be the same.');
            }
        }

        return errors;
    };

    render() {
        return (
            <React.Fragment>
                <Formik
                    initialValues={{
                        old_password: '',
                        new_password: '',
                    }}
                    validate={this.validateFields}
                    onSubmit={this.onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        status,
                        setFieldTouched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
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
                                            error={touched.old_password && errors.old_password}
                                            type='password'
                                            name='old_password'
                                            value={values.old_password}
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                        />
                                        <PasswordMeter
                                            input={this.state.new_pw_input}
                                            error={touched.new_password && errors.new_password}
                                        >
                                            <Input
                                                label={localize('New password')}
                                                type='password'
                                                name='new_password'
                                                value={values.new_password}
                                                onBlur={handleBlur}
                                                onChange={(e) => {
                                                    const input = e.target;
                                                    setFieldTouched('new_password', true);
                                                    if (input) this.updateNewPassword(input.value);
                                                    handleChange(e);
                                                }}
                                            />
                                        </PasswordMeter>
                                    </div>
                                </FormBody>
                            }
                            <FormFooter>
                                {status && status.msg && <FormSubmitErrorMessage message={status.msg} />}
                                <Button
                                    className='btn--secondary'
                                    type='button'
                                    onClick={this.props.onClickSendEmail}
                                    text={localize('Forgot your password?')}
                                />
                                <Button
                                    className='btn--primary'
                                    type='submit'
                                    is_disabled={isSubmitting ||
                                        !!((errors.new_password || !values.new_password) ||
                                        (errors.old_password || !values.old_password))
                                    }
                                    is_loading={this.state.is_btn_loading && <ButtonLoading />}
                                    is_submit_success={this.state.is_submit_success}
                                    has_effect
                                    text={localize('Change Password')}
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
