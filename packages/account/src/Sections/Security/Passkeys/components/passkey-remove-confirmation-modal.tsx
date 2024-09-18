import { MouseEventHandler } from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';

type TPasskeyRemoveConfirmationrModal = {
    onPrimaryButtonClick: MouseEventHandler<HTMLButtonElement>;
    onSecondaryButtonClick: MouseEventHandler<HTMLButtonElement>;
    is_modal_open: boolean;
    toggleModal?: () => void;
};

export const PasskeyRemoveConfirmationModal = ({
    is_modal_open,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
    toggleModal,
}: TPasskeyRemoveConfirmationrModal) => {
    const header = (
        <Text size='xs' weight='bold'>
            <Localize i18n_default_text='Remove passkey' />
        </Text>
    );

    return (
        <Modal
            portalId='modal_root'
            header={header}
            is_open={is_modal_open}
            toggleModal={toggleModal}
            className='passkeys-modal'
            has_close_icon={false}
        >
            <Modal.Body>
                <Text size='xxs'>
                    <Localize i18n_default_text='Are you sure you want to remove this passkey?' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onSecondaryButtonClick} large secondary>
                    <Localize i18n_default_text='Cancel' />
                </Button>
                <Button onClick={onPrimaryButtonClick} large primary>
                    <Localize i18n_default_text='Remove' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
