import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import React from 'react';

const CoolDownWarningModal = ({ show_risk_modal, setShowRiskModal }) => {
    return (
        <Modal
            width='44rem'
            has_close_icon={false}
            is_vertical_centered
            title={localize('24-hour Cool Down Warning')}
            is_open={show_risk_modal}
            className='_risk-tolerance'
        >
            <Modal.Body className='risk-tolerance__body'>
                <Icon icon='IcRedWarning' size={63} className='risk-tolerance__body--icon' color='red' />
                <Text as='p' size='xs' align='center' className='risk-tolerance__body--main-text'>
                    <Localize i18n_default_text='You can create your account on 11 June at 2:00 pm.Please click ‘OK’ to continue.' />
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
};

export default CoolDownWarningModal;
