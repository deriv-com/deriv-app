import React from 'react';
import { Formik, Field, FieldProps, Form } from 'formik';
import { observer } from 'mobx-react-lite';
import { Button, Input, Icon, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import './nickname-form.scss';

type TNicknameFormProps = {
    onCancel?: () => void;
};

const NicknameForm = ({ onCancel }: TNicknameFormProps) => {
    const { general_store } = useStores();

    // TODO: move it to hook when this component will be changed as part of refactoring.
    React.useEffect(() => {
        const closeForm = () => {
            general_store.setShouldShowPopup(false);
        };

        window.addEventListener('popstate', closeForm);
        return () => {
            window.removeEventListener('popstate', closeForm);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Formik
            validate={general_store.validatePopup}
            initialValues={{ nickname: '' }}
            onSubmit={async values => {
                await general_store.createAdvertiser(values.nickname);
            }}
        >
            {({ errors, handleChange, isSubmitting, values }) => (
                <Form noValidate>
                    <div
                        className='nickname-form__content nickname-form__content__centre'
                        data-testid='dt_nickname_form_content'
                    >
                        <Icon icon='IcCashierP2pUser' width='128' height='128' />
                        <Text as='h5' weight='bold' line_height='unset' className='nickname-form__content--title'>
                            {localize('Choose a nickname')}
                        </Text>
                        <Text as='p' size='xs' line_height='unset' className='nickname-form__content--text'>
                            {localize('You will appear to other users as')}
                        </Text>
                        <div className='nickname-form__field_wrapper'>
                            <Field name='nickname'>
                                {({ field }: FieldProps<string>) => (
                                    <Input
                                        {...field}
                                        data-lpignore='true'
                                        error={general_store.nickname_error || errors.nickname}
                                        label={localize('Your nickname')}
                                        className='nickname-form__field'
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            handleChange(e);
                                            general_store.setNicknameError(undefined);
                                        }}
                                        required
                                    />
                                )}
                            </Field>
                        </div>
                        <Text className='nickname-form__content--ps' size='xs'>
                            {localize('Once set, your nickname cannot be changed.')}
                        </Text>
                    </div>
                    <div className='nickname-form__footer'>
                        <Button.Group>
                            <Button
                                secondary
                                type='button'
                                onClick={() => {
                                    onCancel?.();
                                    general_store.onNicknamePopupClose();
                                }}
                                large
                            >
                                {localize('Cancel')}
                            </Button>
                            <Button
                                type='submit'
                                is_disabled={
                                    !!general_store.nickname_error ||
                                    !!errors.nickname ||
                                    !!isSubmitting ||
                                    values.nickname === ''
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
    );
};

export default observer(NicknameForm);
