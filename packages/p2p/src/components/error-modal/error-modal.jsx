import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from '@deriv/components';
import { Localize } from 'Components/i18next';

const ErrorModal = ({ error_message, error_modal_title, is_error_modal_open, setIsErrorModalOpen }) => {
    return (
        <Modal is_open={is_error_modal_open} title={error_modal_title}>
            <Modal.Body>{error_message}</Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={() => setIsErrorModalOpen(false)}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ErrorModal.propTypes = {
    error_message: PropTypes.string,
    error_modal_title: PropTypes.string,
    is_error_modal_open: PropTypes.bool,
    setIsErrorModalOpen: PropTypes.func,
};
