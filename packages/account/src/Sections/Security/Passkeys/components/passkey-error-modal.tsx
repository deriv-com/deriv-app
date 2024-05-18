import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { TServerError } from '../../../../Types/common.type';
import { TSocketError } from '@deriv/api/types';

type TPasskeyErrorModal = {
    // TODO: fix types for TServerError and TSocketError
    error: TServerError | null | TSocketError<'passkeys_list' | 'passkeys_register' | 'passkeys_register_options'>;
    onButtonClick: React.MouseEventHandler<HTMLButtonElement>;
    is_modal_open: boolean;
};

export const PasskeyErrorModal = ({ is_modal_open, error, onButtonClick }: TPasskeyErrorModal) => {
    const NOT_SUPPORTED_ERROR_NAME = 'NotSupportedError';
    const isNotSupportedError = (error: TServerError) => error?.name === NOT_SUPPORTED_ERROR_NAME;

    const error_message_header = (
        <Text size='xs' weight='bold'>
            {isNotSupportedError(error as TServerError) ? (
                <Localize i18n_default_text='Passkey setup failed' />
            ) : (
                <Localize i18n_default_text='Unable to process your request' />
            )}
        </Text>
    );

    const error_message = isNotSupportedError(error as TServerError) ? (
        <Localize i18n_default_text="This device doesn't support passkeys." />
    ) : (
        <Localize i18n_default_text='We’re experiencing a temporary issue in processing your request. Please try again later.' />
    );

    return (
        <Modal
            portalId='modal_root'
            header={error_message_header}
            is_open={is_modal_open}
            has_close_icon={false}
            className='passkeys-modal'
        >
            <Modal.Body>{error_message}</Modal.Body>
            <Modal.Footer>
                <Button onClick={onButtonClick} large primary>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
