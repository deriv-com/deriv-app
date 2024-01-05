import React from 'react';
import { Button, Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';

const LaunchModalButton = ({ handleOpen }: { handleOpen: () => void }) => (
    <Modal.Footer has_separator>
        <Button className='launch-button' has_effect onClick={handleOpen} primary large>
            <Localize i18n_default_text='Try Turbos' />
        </Button>
    </Modal.Footer>
);

export default LaunchModalButton;
