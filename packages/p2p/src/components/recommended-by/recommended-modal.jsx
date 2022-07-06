import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import './recommended-modal.scss';

const RecommendedModal = ({ is_recommended_modal_open, message, setIsRecommendedModalOpen }) => (
    <Modal height='12.6rem' is_open={is_recommended_modal_open} width='32.8rem'>
        <Modal.Body>
            <Text color='prominent' line_height='m' size='xxs'>
                {message}
            </Text>
        </Modal.Body>
        <Modal.Footer>
            <Button large primary onClick={() => setIsRecommendedModalOpen(false)} text={localize('Ok')} />
        </Modal.Footer>
    </Modal>
);

RecommendedModal.propTypes = {
    is_recommended_modal_open: PropTypes.bool,
    message: PropTypes.object,
    setIsRecommendedModalOpen: PropTypes.func,
};

export default RecommendedModal;
