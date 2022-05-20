import PropTypes from 'prop-types';
import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';

const EditAdCancelModal = ({ handleCancelEdit, is_open }) => {
    // const [is_modal_open, setIsModalOpen] = React.useState(is_open);

    // React.useEffect(() => {
    //     setIsModalOpen(is_open);
    // }, [is_open]);

    const handleModalAction = should_cancel_edit => {
        handleCancelEdit(should_cancel_edit);
        setIsModalOpen(prevState => !prevState);
    };

    return (
        <Modal has_close_icon={false} is_open={is_open} small title={localize('Cancel your edits?')}>
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    {localize('If you choose to cancel, the edited details will be lost.')}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('Cancel')} onClick={() => handleModalAction(true)} secondary large />
                <Button
                    has_effect
                    text={localize("Don't cancel")}
                    onClick={() => handleModalAction(false)}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

EditAdCancelModal.propTypes = {
    is_open: PropTypes.bool,
    handleCancelEdit: PropTypes.func,
};

export default EditAdCancelModal;
