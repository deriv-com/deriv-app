import React from 'react';
import { Button, Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';

const LaunchModalContinueButton = ({ handleOpen }: { handleOpen: () => void }) => (
    <Modal.Footer>
        <Button className='continue-button' has_effect onClick={handleOpen} primary large>
            <Localize i18n_default_text='Continue' />
        </Button>
    </Modal.Footer>
);

export default LaunchModalContinueButton;
