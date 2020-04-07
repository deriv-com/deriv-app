import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, ThemedScrollbars, Icon } from '@deriv/components';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { localize, Localize } from 'Components/i18next';
import { countDecimalPlaces } from 'Utils/string';
import { requestWS } from 'Utils/websocket';
import FormError from '../form/error.jsx';
import IconClose from 'Assets/icon-close.jsx';

const NickNameForm = ({ handleClose, setNicknameTrue }) => {
    const handleSubmit = async (values, { setStatus, setSubmitting }) => {
        setStatus({ error_message: '' });
        setNicknameTrue();
    };

    const validatePopup = values => {
        const max_char = 100;
        const validations = {
            amount: [v => !!v, v => v.length >= max_char],
        };

        const common_messages = [localize('Nickname is required'), localize('Nickname is too long')];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) {
                switch (key) {
                    default: {
                        errors[key] = common_messages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    };

    return (
        <>
            <div className='buy-sell__popup-header buy-sell__popup-header--no-border'>
                <div className='buy-sell__popup-header_wrapper buy-sell__popup-header_right'>
                    <IconClose className='buy-sell__popup-close_icon' onClick={handleClose} />
                </div>
            </div>
            <Formik validate={validatePopup} initialValues={{ nickname: '' }} onSubmit={handleSubmit}>
                {({ errors, isSubmitting, handleChange, status }) => (
                    <Form noValidate>
                        <ThemedScrollbars autoHide style={{ height: '289px' }}>
                            <div className='buy-sell__popup-content buy-sell__popup-content_centre'>
                                <Icon icon='IcCashierP2pUser' width='128' height='128' />
                                <div className='buy-sell__popup-field_wrapper'>
                                    <Field name='nickname'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                error={errors.amount}
                                                label={localize('Your nickname')}
                                                className='buy-sell__popup-field'
                                                onChange={handleChange}
                                                required
                                            />
                                        )}
                                    </Field>
                                </div>
                            </div>
                        </ThemedScrollbars>
                        <div className='buy-sell__popup-footer'>
                            {status && status.error_message && <FormError message={status.error_message} />}
                            <Button secondary type='button' onClick={handleClose}>
                                {localize('Cancel')}
                            </Button>
                            <Button is_disabled={!!(isSubmitting || errors.amount)} primary>
                                {localize('Confirm')}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

NickNameForm.propTypes = {
    handleClose: PropTypes.func,
    setNicknameTrue: PropTypes.func,
};

export default NickNameForm;
