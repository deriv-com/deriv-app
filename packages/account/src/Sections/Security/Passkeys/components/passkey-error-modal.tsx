import { Button, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';

import { TServerError } from '../../../../Types';
import { isNotSupportedError, TPasskeyError } from '../passkeys-configs';

type TPasskeyErrorModal = {
    error: TPasskeyError;
    onButtonClick: () => void;
    is_modal_open: boolean;
};

const getErrorModalContent = (error: TPasskeyError) => {
    const error_message_header = (
        <Text size='xs' weight='bold'>
            {isNotSupportedError(error as TServerError) ? (
                <Localize i18n_default_text='Biometric setup failed' />
            ) : (
                <Localize i18n_default_text='Unable to process your request' />
            )}
        </Text>
    );

    const error_message = isNotSupportedError(error as TServerError) ? (
        <Localize i18n_default_text="This device doesn't support biometrics." />
    ) : (
        <Localize i18n_default_text="We're facing a temporary issue. Try again later." />
    );

    return {
        error_message_header,
        error_message,
    };
};

export const PasskeyErrorModal = ({ is_modal_open, error, onButtonClick }: TPasskeyErrorModal) => {
    const error_modal_content = getErrorModalContent(error);

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
