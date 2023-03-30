import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const ErrorModal = ({ error_message, error_modal_title, has_close_icon, onClose, width }) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal
            className='error-modal'
            has_close_icon={has_close_icon}
            is_open={is_modal_open}
            title={error_modal_title}
            width={width}
        >
            <Modal.Body className='error-modal__body'>{error_message}</Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={onClose ?? hideModal}>
                    <Localize i18n_default_text='Ok' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ErrorModal.propTypes = {
    error_message: PropTypes.string,
    error_modal_title: PropTypes.string,
    has_close_icon: PropTypes.bool,
    onClose: PropTypes.func,
    width: PropTypes.string,
};

export default observer(ErrorModal);
