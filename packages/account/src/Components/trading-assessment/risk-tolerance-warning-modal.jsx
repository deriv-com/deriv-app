import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const RiskToleranceWarningModal = ({ show_risk_modal, onClick, title, button_text, body_content }) => {
    return (
        <Modal
            width='44rem'
            height='44rem'
            title={title}
            is_open={show_risk_modal}
            has_close_icon={false}
            className='center-risk-modal'
        >
            <Modal.Body>
                <Icon icon='IcRedWarning' size={63} />
                <Text as='p' size='xs' align='center' line_height='0.24rem' className='risk-acceptance__text'>
                    {body_content}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={button_text ?? localize('OK')} primary onClick={onClick} />
            </Modal.Footer>
        </Modal>
    );
};

export default RiskToleranceWarningModal;
