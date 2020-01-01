import { Button }               from 'deriv-components';
import { Formik }               from 'formik';
import React, { PureComponent } from 'react';
import {
    Localize,
    localize,
}                               from 'deriv-translations';
import MT5PasswordContainer     from '../Containers/mt5-password-container.jsx';
import {
    validPassword,
    validLength,
}                               from 'Utils/Validator/declarative-validation-rules';

class Mt5Password extends PureComponent {
    onChange = (e, setFieldValue, setFieldTouched) => {
        setFieldTouched('password', true);
        setFieldValue('password', e.target.value, true);
    };

    validate = (values) => {
        const is_valid = validPassword(values.password) &&
            validLength(values.password, {
                min: 8,
                max: 25,
            });
        const errors   = {};

        if (!is_valid) {
            errors.password = localize('You need to include uppercase and lowercase letters, and numbers.');
        }

        return errors;
    };

    onSubmit = (values, actions) => {
        this.props.onSave(this.props.index, values);
        this.props.onSubmit(this.props.index, values, actions.setSubmitting);
    };

    handleCancel = (values) => {
        this.props.onSave(this.props.index, values);
        this.props.onCancel();
    };

    render() {
        return (
            <div className='mt5-advanced-password'>
                <Formik
                    initialValues={{
                        password: '',
                    }}
                    validate={this.validate}
                    onSubmit={(values, actions) => {
                        this.onSubmit(
                            values,
                            actions.setSubmitting,
                        );
                    }}
                    render={({
                        handleSubmit,
                        setFieldValue,
                        setFieldTouched,
                        handleBlur,
                        errors,
                        touched,
                        values,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <h1><Localize i18n_default_text='Choose a password for your DMT5 real advanced account' />
                            </h1>
                            <div className='mt5-advanced-password__form-body'>
                                <MT5PasswordContainer
                                    className='mt5-advanced-password__form'
                                    account_title={localize('Real Advanced')}
                                    onChange={(e) => this.onChange(e, setFieldValue, setFieldTouched)}
                                    onBlur={handleBlur}
                                    error={touched.password && errors.password}
                                    value={values.password}
                                />
                                <div className='mt5-advanced-password__description'>
                                    <p>
                                        <Localize
                                            i18n_default_text='Your MT5 advanced account will be opened through Binary (FX) Ltd. All trading in this account is subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA). All other accounts, including your Deriv account, are not subject to the regulations and guidelines of the Labuan Financial Services Authority (LFSA).'
                                        />
                                    </p>
                                </div>
                            </div>
                            <div className='mt5-advanced-password__btn'>
                                <Button
                                    primary
                                    is_disabled={!!(this.validate(values)).password}
                                    type='submit'
                                    onClick={() => console.log('Clicked', values.password)}
                                >
                                    <Localize
                                        i18n_default_text='Add account'
                                    />
                                </Button>
                            </div>
                        </form>
                    )}
                />
            </div>
        );
    }
}

export default Mt5Password;
