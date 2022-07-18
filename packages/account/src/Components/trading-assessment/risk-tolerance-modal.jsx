import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';

const RiskToleranceWarningModal = ({ show_risk_modal, setShowRiskModal }) => (
    <Modal
        width='44rem'
        height='44rem'
        has_close_icon={false}
        title={localize('Risk Tolerance Warning')}
        is_open={show_risk_modal}
        className='_risk-tolerance'
    >
        <Modal.Body className='risk-tolerance__body'>
            <Icon icon='IcRedWarning' size={63} className='risk-tolerance__body--icon' color='red' />
            <Text as='p' size='xs' align='center' className='risk-tolerance__body--main-text'>
                <Localize i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money.' />
            </Text>
            <Text as='p' size='xs' align='center' className='risk-tolerance__body--bottom-text'>
                <Localize i18n_default_text='To continue, kindly note that you would need to wait 24 hours before you can proceed further.' />
            </Text>
        </Modal.Body>
        <Modal.Footer className='risk-tolerance__footer'>
            <Button
                className='risk-tolerance__footer--button'
                type='button'
                large
                text={localize('OK')}
                primary
                onClick={() => {
                    setShowRiskModal(false);
                }}
            />
        </Modal.Footer>
    </Modal>
);

export default RiskToleranceWarningModal;
