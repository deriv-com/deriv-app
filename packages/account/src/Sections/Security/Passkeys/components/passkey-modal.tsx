import React from 'react';
import { Button, Modal } from '@deriv/components';

type TPasskeyModal = {
    title?: React.ReactElement;
    //TODO remove string from types
    description?: React.ReactElement | string;
    button_text: React.ReactElement;
    onButtonClick: () => void;
    is_modal_open: boolean;
};

const PasskeyModal = ({ is_modal_open, title, description, button_text, onButtonClick }: TPasskeyModal) => {
    return (
        <React.Fragment>
            <Modal
                title={title}
                is_open={is_modal_open}
                // toggleModal={() => {}}
                has_close_icon={false}
                className='passkeys-modal'
            >
                <Modal.Body>{description}</Modal.Body>
                <Modal.Footer>
                    <Button onClick={onButtonClick} large primary>
                        {button_text}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default PasskeyModal;
