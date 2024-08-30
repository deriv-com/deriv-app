import React from 'react';
import { Formik, Field, FieldProps, Form } from 'formik';
import { Button, Input, Icon, Modal, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

type TNicknameModalProps = {
    onCancel?: () => void;
    onConfirm?: () => void;
    should_hide_close_btn?: boolean;
};

const NicknameModal = ({ onCancel, onConfirm, should_hide_close_btn = false }: TNicknameModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { general_store } = useStores();
    const { notifications } = useStore();

    return (
        <Modal has_close_icon={false} width='440px' is_open={is_modal_open} renderTitle={() => <></>}>
            <Modal.Body>
                <Formik
                    validate={general_store.validatePopup}
                    initialValues={{ nickname: '' }}
                    onSubmit={async values => {
                        await general_store.createAdvertiser(values.nickname);
                        if (general_store.nickname_error) {
                            general_store.validatePopup(values);
                        } else {
                            notifications.addNotificationMessage({
                                key: 'p2p_advertiser_nickname_added',
                                header: <Localize i18n_default_text='Nickname added successfully!' />,
                                platform: 'P2P',
                                should_hide_close_btn,
                                type: 'announce',
                                only_toast_message: true,
                            });
                            hideModal();
                            onConfirm?.();
                        }
                    }}
                >
                    {({ errors, handleChange, isSubmitting, values }) => (
                        <Form noValidate>
                            <div
                                className='nickname-modal__content nickname-modal__content--centre'
                                data-testid='dt_nickname_form_content'
                            >
                                <Icon icon='IcCashierP2pUser' width='128' height='128' />
                                <Text as='h5' weight='bold' className='nickname-modal__content--title'>
                                    <Localize i18n_default_text='What’s your nickname?' />
                                </Text>
                                <Text align='center' as='p' size='xs' className='nickname-modal__content--text'>
                                    <Localize i18n_default_text='Others will see this on your profile, ads, and chats.' />
                                </Text>
                                <div className='nickname-modal__field_wrapper'>
                                    <Field name='nickname'>
                                        {({ field }: FieldProps<string>) => (
                                            <Input
                                                {...field}
                                                data-lpignore='true'
                                                error={general_store.nickname_error || errors.nickname}
                                                label={localize('Your nickname')}
                                                className='nickname-modal__field'
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    handleChange(e);
                                                    general_store.setNicknameError(undefined);
                                                }}
                                                required
                                            />
                                        )}
                                    </Field>
                                </div>
                                <Text align='center' className='nickname-modal__content--note' size='xs'>
                                    <Localize i18n_default_text='Your nickname cannot be changed later.' />
                                </Text>
                            </div>
                            <div className='nickname-modal__footer'>
                                <Button.Group>
                                    <Button
                                        secondary
                                        type='button'
                                        onClick={() => {
                                            hideModal();
                                            general_store.setNicknameError('');
                                            onCancel?.();
                                        }}
                                        large
                                    >
                                        <Localize i18n_default_text='Cancel' />
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
                                        <Localize i18n_default_text='Confirm' />
                                    </Button>
                                </Button.Group>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default NicknameModal;
