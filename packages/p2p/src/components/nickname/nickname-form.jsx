import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form } from 'formik';
import { Input, Button, Icon, Text } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import IconClose from 'Assets/icon-close.jsx';
import './nickname-form.scss';

const NicknameForm = observer(({ handleClose }) => {
    const { general_store } = useStores();

    return (
        <>
            {!general_store.props.is_mobile && (
                <div className='nickname__form-header nickname__form-header--no-border'>
                    <div className='nickname__form-header_wrapper nickname__form-header_right'>
                        <IconClose className='nickname__form-close_icon' onClick={handleClose} />
                    </div>
                </div>
            )}
            <Formik
                validate={general_store.validatePopup}
                initialValues={{ nickname: '' }}
                onSubmit={async values => {
                    await general_store.createAdvertiser(values.nickname);
                }}
            >
                {({ errors, handleChange, isSubmitting, values }) => (
                    <Form className='nickname__form-wrapper' noValidate>
                        <div className='nickname__form-content nickname__form-content__centre'>
                            <Icon icon='IcCashierP2pUser' width='128' height='128' />
                            <h5 className='nickname__form-content--title'>{localize('Choose a nickname')}</h5>
                            <Text as='p' size='xs' line_height='unset' className='nickname__form-content--text'>
                                {localize('You will appear to other users as')}
                            </Text>
                            <div className='nickname__form-field_wrapper'>
                                <Field name='nickname'>
                                    {({ field }) => (
                                        <Input
                                            {...field}
                                            data-lpignore='true'
                                            error={general_store.nickname_error || errors.nickname}
                                            label={localize('Your nickname')}
                                            className='nickname__form-field'
                                            onChange={e => {
                                                handleChange(e);
                                                general_store.resetNicknameErrorState();
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
                        <div className='nickname__form-footer'>
                            <Button.Group>
                                <Button secondary type='button' onClick={handleClose} large>
                                    {localize('Cancel')}
                                </Button>
                                <Button
                                    type='submit'
                                    is_disabled={
                                        !!errors.nickname ||
                                        values.nickname === '' ||
                                        isSubmitting ||
                                        general_store.nickname_error
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
});

NicknameForm.propTypes = {
    handleClose: PropTypes.func,
    nickname_error: PropTypes.string,
    setNicknameTrue: PropTypes.func,
    validatePopup: PropTypes.func,
};

export default NicknameForm;
