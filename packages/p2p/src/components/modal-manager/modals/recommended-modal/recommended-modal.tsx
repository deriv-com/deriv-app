import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

type TRecommendedModalProps = {
    message: string;
};

const RecommendedModal = ({ message }: TRecommendedModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();

    return (
        <Modal height='12.6rem' is_open={is_modal_open} width='32.8rem'>
            <Modal.Body>
                <Text color='prominent' size='xxs'>
                    {message}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button large primary onClick={() => hideModal()} text={localize('Ok')} />
            </Modal.Footer>
        </Modal>
    );
};

export default RecommendedModal;
