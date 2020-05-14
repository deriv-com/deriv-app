import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, ThemedScrollbars, Icon } from '@deriv/components';
import { localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import IconClose from 'Assets/icon-close.jsx';
import FormError from '../form/error.jsx';

const NicknameForm = ({ handleClose, setNickname, setChatInfo }) => {
    const handleSubmit = (values, { setStatus, setSubmitting }) => {
        requestWS({ p2p_advertiser_create: 1, name: values.nickname }).then(response => {
            if (response.error) {
                setStatus({ error_message: response.error.message });
            } else {
                const { p2p_advertiser_create } = response;

                setNickname(p2p_advertiser_create.name);
                setChatInfo(p2p_advertiser_create.chat_user_id, p2p_advertiser_create.chat_token);
            }

            setSubmitting(false);
        });
    };

    const validatePopup = values => {
        const max_char = 100;
        const validations = {
            nickname: [v => !!v, v => v.length <= max_char],
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
                                <h5 className='buy-sell__popup-content--title'>{localize('Choose a nickname')}</h5>
                                <p className='buy-sell__popup-content--text'>
                                    {localize('This is how you will appear to other users')}
                                </p>
                                <div className='buy-sell__popup-field_wrapper'>
                                    <Field name='nickname'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                error={errors.nickname}
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
                            <Button secondary type='button' onClick={handleClose} large>
                                {localize('Cancel')}
                            </Button>
                            <Button type='submit' is_disabled={!!(isSubmitting || errors.amount)} primary large>
                                {localize('Confirm')}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

NicknameForm.propTypes = {
    handleClose: PropTypes.func,
    setNicknameTrue: PropTypes.func,
};

export default NicknameForm;
