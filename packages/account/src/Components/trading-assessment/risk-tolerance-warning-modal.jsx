import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const RiskToleranceWarningModal = ({ show_risk_modal, setShowRiskModal, title }) => {
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
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, kindly note that you would need to wait 24 hours before you can proceed further.'
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={localize('OK')} primary onClick={() => setShowRiskModal(false)} />
            </Modal.Footer>
        </Modal>
    );
};

export default RiskToleranceWarningModal;
