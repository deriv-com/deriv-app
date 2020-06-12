import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, ThemedScrollbars, Icon } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import { requestWS } from 'Utils/websocket';
import IconClose from 'Assets/icon-close.jsx';
import FormError from '../form/error.jsx';
import './nickname-form.scss';

const NicknameForm = ({ handleClose, handleConfirm }) => {
    const { setNickname, setIsAdvertiser, setChatInfo } = React.useContext(Dp2pContext);

    const handleSubmit = (values, { setStatus, setSubmitting }) => {
        requestWS({ p2p_advertiser_create: 1, name: values.nickname }).then(response => {
            if (response.error) {
                setStatus({ error_message: response.error.message });
            } else {
                const { p2p_advertiser_create } = response;

                setNickname(p2p_advertiser_create.name);
                setIsAdvertiser(p2p_advertiser_create.is_approved);
                setChatInfo(p2p_advertiser_create.chat_user_id, p2p_advertiser_create.chat_token);
                if (typeof handleConfirm === 'function') {
                    handleConfirm();
                }
            }

            setSubmitting(false);
        });
    };

    const validatePopup = values => {
        const validations = {
            nickname: [
                v => !!v,
                v => v.length >= 2,
                v => v.length <= 24,
                v => /^(?!(.*(.)\\2{4,})|.*[\\.@_-]{2,}|^([\\.@_-])|.*([\\.@_-])$)[a-zA-Z0-9-_@.]{2,24}$/.test(v),
            ],
        };

        const nickname_messages = [
            localize('Nickname is required'),
            localize('Nickname is too short'),
            localize('Nickname is too long'),
            localize('Nickname is in incorrect format'),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) {
                switch (key) {
                    default: {
                        errors[key] = nickname_messages[error_index];
                        break;
                    }
                }
            }
        });

        return errors;
    };

    return (
        <>
            <div className='nickname__form-header nickname__form-header--no-border'>
                <div className='nickname__form-header_wrapper nickname__form-header_right'>
                    <IconClose className='nickname__form-close_icon' onClick={handleClose} />
                </div>
            </div>
            <Formik validate={validatePopup} initialValues={{ nickname: '' }} onSubmit={handleSubmit}>
                {({ errors, isSubmitting, handleChange, status }) => (
                    <Form noValidate>
                        <ThemedScrollbars height='289px'>
                            <div className='nickname__form-content nickname__form-content_centre'>
                                <Icon icon='IcCashierP2pUser' width='128' height='128' />
                                <h5 className='nickname__form-content--title'>{localize('Choose a nickname')}</h5>
                                <p className='nickname__form-content--text'>
                                    {localize('This is how you will appear to other users')}
                                </p>
                                <div className='nickname__form-field_wrapper'>
                                    <Field name='nickname'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                error={errors.nickname}
                                                label={localize('Your nickname')}
                                                className='nickname__form-field'
                                                onChange={handleChange}
                                                required
                                            />
                                        )}
                                    </Field>
                                </div>
                            </div>
                        </ThemedScrollbars>
                        <div className='nickname__form-footer'>
                            {status && status.error_message && <FormError message={status.error_message} />}
                            <Button.Group>
                                <Button secondary type='button' onClick={handleClose} large>
                                    {localize('Cancel')}
                                </Button>
                                <Button type='submit' is_disabled={!!(isSubmitting || errors.nickname)} primary large>
                                    {localize('Confirm')}
                                </Button>
                            </Button.Group>
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
