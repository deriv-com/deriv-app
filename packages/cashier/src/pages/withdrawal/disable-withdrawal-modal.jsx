import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const DisableWithdrawalModal = ({ is_risk_client, onClick }) => {
    return (
        <Modal is_open={is_risk_client} small className='center-risk-modal' title={localize('Financial Assessment')}>
            <Modal.Body>
                <Text as='p' size='s' align='center'>
                    <Localize i18n_default_text='You can only make deposits at the moment. To enable withdrawals, please complete your financial assessment.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={localize('Start assessment')} primary onClick={onClick} />
            </Modal.Footer>
        </Modal>
    );
};

export default DisableWithdrawalModal;
