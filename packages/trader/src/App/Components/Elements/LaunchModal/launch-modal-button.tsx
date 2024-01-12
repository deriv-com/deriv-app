import React from 'react';
import { Button, Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';

const LaunchModalButton = ({
    handleOpen,
    setShowDescription,
}: {
    handleOpen: () => void;
    setShowDescription: (status: boolean) => void;
}) => (
    <Modal.Footer has_separator>
        <Button
            className='launch-button'
            has_effect
            onClick={() => {
                handleOpen();
                setShowDescription(true);
            }}
            secondary
            large
        >
            <Localize i18n_default_text='Learn more' />
        </Button>
        <Button className='launch-button' has_effect onClick={handleOpen} primary large>
            <Localize i18n_default_text='Ok' />
        </Button>
    </Modal.Footer>
);

export default LaunchModalButton;
