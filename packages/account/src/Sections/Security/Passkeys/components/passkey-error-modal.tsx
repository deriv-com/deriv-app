import { Button, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { isNotSupportedError, PASSKEY_STATUS_CODES, TPasskeyError, TPasskeysStatus } from '../passkeys-configs';
import { TServerError } from '../../../../Types';

type TPasskeyErrorModal = {
    error: TPasskeyError;
    onButtonClick: () => void;
    is_modal_open: boolean;
    passkey_status: TPasskeysStatus;
};

const getErrorModalContent = (error: TPasskeyError, passkey_status: TPasskeysStatus) => {
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

    if (passkey_status === PASSKEY_STATUS_CODES.REMOVING) {
        return {
            error_message_header: (
                <Text size='xs' weight='bold'>
                    <Localize i18n_default_text='Verification failed' />
                </Text>
            ),
            error_message: (
                <Localize i18n_default_text='Verification unsuccessful. Please try again or verify with email instead.' />
            ),
        };
    }

    return {
        error_message_header,
        error_message,
    };
};

export const PasskeyErrorModal = ({ is_modal_open, error, onButtonClick, passkey_status }: TPasskeyErrorModal) => {
    const error_modal_content = getErrorModalContent(error, passkey_status);

    return (
        <Modal
            portalId='modal_root'
            header={error_modal_content.error_message_header}
            is_open={is_modal_open}
            has_close_icon={false}
            className='passkeys-modal'
        >
            <Modal.Body>{error_modal_content.error_message}</Modal.Body>
            <Modal.Footer>
                <Button onClick={onButtonClick} large primary>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
