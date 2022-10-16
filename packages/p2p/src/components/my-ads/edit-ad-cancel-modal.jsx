import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';

const EditAdCancelModal = ({ onClick, is_open }) => {
    return (
        <Modal has_close_icon={false} is_open={is_open} small title={localize('Cancel your edits?')}>
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {localize('If you choose to cancel, the edited details will be lost.')}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Cancel')} onClick={() => onClick(true)} secondary large />
                <Button has_effect text={localize("Don't cancel")} onClick={() => onClick(false)} primary large />
            </Modal.Footer>
        </Modal>
    );
};

EditAdCancelModal.propTypes = {
    is_open: PropTypes.bool,
    onClick: PropTypes.func,
};

export default EditAdCancelModal;
