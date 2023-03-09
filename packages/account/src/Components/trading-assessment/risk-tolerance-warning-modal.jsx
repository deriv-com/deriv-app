import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';

const RiskToleranceWarningModal = ({ show_risk_modal, handleAcceptRisk, title, button_text, body_content }) => {
    return (
        <Modal
            width='44rem'
            title={title}
            height={isMobile() ? '44rem' : '41rem'}
            is_open={show_risk_modal}
            className='center-risk-modal'
            toggleModal={handleAcceptRisk}
            has_close_icon={!isMobile()}
        >
            <Modal.Body>
                <Icon icon='IcRedWarning' size={isMobile() ? 65 : 63} />
                <Text
                    as='p'
                    size='xs'
                    align='center'
                    line_height={isMobile() ? 'l' : 's'}
                    className='risk-acceptance__text'
                >
                    {body_content}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={button_text || localize('OK')} primary onClick={handleAcceptRisk} />
            </Modal.Footer>
        </Modal>
    );
};

export default RiskToleranceWarningModal;
