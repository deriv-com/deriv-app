import React from 'react';
import { Button, Modal } from '@deriv/components';
import { Localize } from '@deriv/translations';

type TUrlUnavailableModalProps = React.PropsWithChildren<{
    button_name?: string | React.ReactNode;
    is_visible: boolean;
    onConfirm: () => void;
    title?: string | React.ReactNode;
}>;

const UrlUnavailableModal = ({ button_name, children, is_visible, onConfirm, title }: TUrlUnavailableModalProps) => (
    <Modal
        small
        is_open={is_visible}
        title={title}
        toggleModal={onConfirm}
        className='account-verification-pending-modal'
    >
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
            <Button has_effect onClick={onConfirm} primary large>
                {button_name ?? <Localize i18n_default_text='OK' />}
            </Button>
        </Modal.Footer>
    </Modal>
);

export default UrlUnavailableModal;
