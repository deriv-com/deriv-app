import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';

const RiskToleranceWarningModal = ({ show_risk_modal, setShowRiskModal }) => (
    <Modal
        small
        is_vertical_centered
        is_confirmation_modal
        title={localize('Risk Tolerane Warning')}
        is_open={show_risk_modal}
        onClose={() => setShowRiskModal(false)}
        className='risk-acceptance'
    >
        <Modal.Body className='risk-acceptance__body'>
            <Icon icon='IcRedWarning' size={63} />
            <Text as='p' size='xs'>
                <Localize
                    i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><1/> To continue, kindly note that you would need to wait 24 hours before you can proceed further.'
                    components={[<br key={0} />, <br key={1} />]}
                />
            </Text>
        </Modal.Body>
        <Modal.Footer>
            <Button type='button' large text={localize('OK')} primary />
        </Modal.Footer>
    </Modal>
);

export default RiskToleranceWarningModal;
