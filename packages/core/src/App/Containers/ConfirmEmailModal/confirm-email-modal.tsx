import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import SentEmailModal from '@deriv/account/src/Components/sent-email-modal';
import { observer, useStore } from '@deriv/stores';
import { WS, removeActionParam } from '@deriv/shared';
import { TSocketError, TSocketRequest, TSocketResponse } from '@deriv/api/types';

type TConfirmEmailModal = {
    changed_email: string;
    is_open: boolean;
    onClose: () => void;
    prev_email: string;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setEmailValue: React.Dispatch<React.SetStateAction<string>>;
};

export const ConfirmEmailModal = observer(
    ({ changed_email, is_open, onClose, prev_email, setErrorMessage, setEmailValue }: TConfirmEmailModal) => {
        const [email_request, setEmailRequest] = React.useState<null | TSocketRequest<'change_email'>>(null);
        const [is_send_email_modal_open, setIsSendEmailModalOpen] = React.useState(false);
        const [is_modal_open, setIsModalOpen] = React.useState(is_open);

        const { client } = useStore();
        const { verification_code, setVerificationCode, setPreventRedirectToHub } = client;

        const handleSubmit = () => {
            const api_request: TSocketRequest<'change_email'> = {
                change_email: 'verify',
                new_email: changed_email,
                verification_code: verification_code.request_email,
            };

            setEmailRequest(prev => ({ ...prev, ...api_request }));

            WS.changeEmail(api_request).then(
                (response: TSocketResponse<'change_email'> & TSocketError<'change_email'>) => {
                    setIsModalOpen(false);
                    if (response.error) {
                        onClose();
                        setEmailValue(changed_email);
                        setErrorMessage(response.error.message);
                    } else {
                        setIsSendEmailModalOpen(true);
                    }
                    removeActionParam('request_email');
                    setVerificationCode('', 'request_email');
                }
            );
        };

        const resendEmail = () => {
            WS.changeEmail(email_request);
        };

        if (is_send_email_modal_open) {
            return (
                <SentEmailModal
                    is_open={is_send_email_modal_open}
                    onClose={() => {
                        setIsSendEmailModalOpen(false);
                        setPreventRedirectToHub(false);
                    }}
                    identifier_title={'Change_Email'}
                    onClickSendEmail={resendEmail}
                    has_live_chat
                    is_modal_when_mobile
                />
            );
        }
        return (
            <Modal
                is_open={is_modal_open}
                should_header_stick_body
                title={<Localize i18n_default_text='Are you sure?' />}
                toggleModal={onClose}
                width='440px'
                has_close_icon={false}
            >
                <React.Fragment>
                    <div className='email-confirmation'>
                        <Text as='p' color='prominent' size='xs' align='left'>
                            <Localize
                                i18n_default_text='Are you sure you want to update email <0>{{prev_email}}</0> to <1>{{changed_email}}</1>?'
                                values={{ prev_email, changed_email }}
                                components={[
                                    <strong key={0} />,
                                    <strong key={1} className='email-confirmation__currentEmail' />,
                                ]}
                            />
                        </Text>
                    </div>
                    <Modal.Footer>
                        <Button onClick={onClose} has_effect text={localize('Cancel')} secondary large />
                        <Button
                            className='email-change_button'
                            has_effect
                            onClick={() => {
                                handleSubmit();
                            }}
                            primary
                            large
                        >
                            <Localize i18n_default_text='Confirm' />
                        </Button>
                    </Modal.Footer>
                </React.Fragment>
            </Modal>
        );
    }
);
