import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const CooldownWarningModal = ({ show_cool_down_modal, setShowCoolDownModal }) => {
    return (
        <Modal
            width='44rem'
            height='44.4rem'
            title={localize('24-hour Cool Down Warning')}
            is_open={show_cool_down_modal}
            className='risk-tolerance'
        >
            <Modal.Body>
                <Icon icon='IcRedWarning' size={63} />
                <Text as='p' size='xs' align='center'>
                    <Localize i18n_default_text='You can create your account on 11 June at 2:00 pm. Please click ‘OK’ to continue.' />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    type='button'
                    large
                    text={localize('OK')}
                    primary
                    onClick={() => {
                        setShowCoolDownModal(false);
                    }}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default CooldownWarningModal;
