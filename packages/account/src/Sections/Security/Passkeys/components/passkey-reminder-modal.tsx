import { MouseEventHandler } from 'react';

import { Button, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';

type TPasskeyReminderModal = {
    onButtonClick: MouseEventHandler<HTMLButtonElement>;
    is_modal_open: boolean;
    toggleModal?: () => void;
};

const getReminderModalContent = () => {
    const reminder_tips = [
        <Localize i18n_default_text='Enable screen lock on your device.' key='tip_1' />,
        <Localize i18n_default_text='Sign in to your Google or iCloud account.' key='tip_2' />,
    ];

    return (
        <ul>
            {reminder_tips.map(tip => (
                <Text as='li' key={tip.key} size='xxs' line_height='l'>
                    {tip}
                </Text>
            ))}
        </ul>
    );
};

export const PasskeyReminderModal = ({ is_modal_open, onButtonClick, toggleModal }: TPasskeyReminderModal) => {
    const header = (
        <Text size='xs' weight='bold'>
            <Localize i18n_default_text='Set up biometrics' />
        </Text>
    );

    return (
        <Modal
            portalId='modal_root'
            header={header}
            is_open={is_modal_open}
            toggleModal={toggleModal}
            className='passkeys-modal'
        >
            <Modal.Body>{getReminderModalContent()}</Modal.Body>
            <Modal.Footer>
                <Button onClick={onButtonClick} large primary>
                    <Localize i18n_default_text='Continue' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
