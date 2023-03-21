import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const RecommendedModal = ({ message }) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal height='12.6rem' is_open={is_modal_open} width='32.8rem'>
            <Modal.Body>
                <Text color='prominent' line_height='m' size='xxs'>
                    {message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={hideModal} text={localize('Ok')} />
            </Modal.Footer>
        </Modal>
    );
};

RecommendedModal.propTypes = {
    message: PropTypes.object,
};

export default RecommendedModal;
