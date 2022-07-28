import React from 'react';
import { Button, DesktopWrapper, Icon, MobileDialog, MobileWrapper, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';

const RiskToleranceWarningModal = ({ show_risk_modal, onClick, title, button_text, body_content }) => {
    return (
        <React.Fragment>
            <MobileWrapper>
                <MobileDialog
                    portal_element_id='modal_root'
                    visible={show_risk_modal}
                    title={title}
                    wrapper_classname='risk-acceptance'
                    has_close_icon={false}
                >
                    <Icon icon='IcRedWarning' size={65} />
                    <Text as='p' size='xs' align='center' line_height='0.18rem'>
                        <Localize
                            i18n_default_text='CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage. You should consider whether you understand how CFDs and other financial instruments work and whether you can afford to take the high risk of losing your money. <0/><0/> To continue, kindly note that you would need to wait 24 hours before you can proceed further.'
                            components={[<br key={0} />]}
                        />
                    </Text>
                    <Button type='button' large text={localize('OK')} primary onClick={onClick} />
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
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
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default RiskToleranceWarningModal;
