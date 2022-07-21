import React from 'react';
import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const CooldownWarningModal = ({ show_cool_down_modal, setShowCoolDownModal }) => {
    return (
        <Modal
            width='44rem'
            title={localize('24-hour Cool Down Warning')}
            is_open={show_cool_down_modal}
            className='center-risk-modal'
        >
            <Modal.Body>
                <Text as='p' size='xs' align='center'>
                    <Localize
                        i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the risk of losing your money.
                        <0/><0/> As you have declined our previous warning, you would need to wait 24 hours before you can proceed further.'
                        components={[<br key={0} />]}
                    />
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
