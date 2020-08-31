import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, ThemedScrollbars, Icon } from '@deriv/components';
import Dp2pContext from 'Components/context/dp2p-context';
import { localize } from 'Components/i18next';
import IconClose from 'Assets/icon-close.jsx';
import './nickname-form.scss';

const NicknameForm = ({ handleClose }) => {
    const { createAdvertiser, is_mobile, nickname_error, resetNicknameErrorState } = React.useContext(Dp2pContext);

    const validatePopup = values => {
        const validations = {
            nickname: [
                v => !!v,
                v => v.length >= 2,
                v => v.length <= 24,
                v => /^[a-zA-Z0-9\\.@_-]{2,24}$/.test(v),
                v => /^(?!(.*(.)\\2{4,})|.*[\\.@_-]{2,}|^([\\.@_-])|.*([\\.@_-])$)[a-zA-Z0-9\\.@_-]{2,24}$/.test(v),
                v =>
                    Array.from(v).every(
                        word => (v.match(new RegExp(word === '.' ? `\\${word}` : word, 'g')) || []).length <= 5
                    ),
            ],
        };

        const nickname_messages = [
            localize('Nickname is required'),
            localize('Nickname is too short'),
            localize('Nickname is too long'),
            localize('Can only contain letters, numbers, and special characters .- _ @.'),
            localize('Cannot start, end with, or repeat special characters.'),
            localize('Cannot repeat a character more than 5 times.'),
        ];

        const errors = {};

        Object.entries(validations).forEach(([key, rules]) => {
            const error_index = rules.findIndex(v => {
                return !v(values[key]);
            });

            if (error_index !== -1) {
                switch (key) {
                    case 'nickname':
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
            {!is_mobile && (
                <div className='nickname__form-header nickname__form-header--no-border'>
                    <div className='nickname__form-header_wrapper nickname__form-header_right'>
                        <IconClose className='nickname__form-close_icon' onClick={handleClose} />
                    </div>
                </div>
            )}
            <Formik
                validate={validatePopup}
                initialValues={{ nickname: '' }}
                onSubmit={async values => {
                    await createAdvertiser(values.nickname);
                }}
            >
                {({ errors, handleChange, isSubmitting, values }) => (
                    <Form noValidate>
                        <ThemedScrollbars autoHide style={{ height: '437px' }}>
                            <div className='nickname__form-content nickname__form-content__centre'>
                                <Icon icon='IcCashierP2pUser' width='128' height='128' />
                                <h5 className='nickname__form-content--title'>{localize('Choose a nickname')}</h5>
                                <p className='nickname__form-content--text'>
                                    {localize('You will appear to other users as')}
                                </p>
                                <div className='nickname__form-field_wrapper'>
                                    <Field name='nickname'>
                                        {({ field }) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                error={nickname_error || errors.nickname}
                                                label={localize('Your nickname')}
                                                className='nickname__form-field'
                                                onChange={e => {
                                                    handleChange(e);
                                                    resetNicknameErrorState();
                                                }}
                                                required
                                            />
                                        )}
                                    </Field>
                                </div>
                                <div className='nickname__form-content--ps'>
                                    {localize('Once set, your nickname cannot be changed.')}
                                </div>
                            </div>
                        </ThemedScrollbars>
                        <div className='nickname__form-footer'>
                            <Button.Group>
                                <Button secondary type='button' onClick={handleClose} large>
                                    {localize('Cancel')}
                                </Button>
                                <Button
                                    type='submit'
                                    is_disabled={
                                        !!errors.nickname || values.nickname === '' || isSubmitting || nickname_error
                                    }
                                    primary
                                    large
                                >
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
