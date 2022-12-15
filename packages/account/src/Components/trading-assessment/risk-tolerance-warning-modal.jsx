import React from 'react';
import { Button, DesktopWrapper, Icon, MobileDialog, MobileWrapper, Modal, Text } from '@deriv/components';
import { localize } from '@deriv/translations';

const RiskToleranceWarningModal = ({ show_risk_modal, onClick, title, button_text, body_content, has_icon }) => {
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
                    <Text as='p' size='xs' align='center' line_height='l'>
                        {body_content}
                    </Text>
                    <Button type='button' large text={button_text || localize('OK')} primary onClick={onClick} />
                </MobileDialog>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal
                    width='44rem'
                    height={has_icon ? '44rem' : '37.4rem'}
                    title={title}
                    is_open={show_risk_modal}
                    has_close_icon={false}
                    className='center-risk-modal'
                >
                    <Modal.Body>
                        {has_icon && <Icon icon='IcRedWarning' size={63} />}
                        <Text as='p' size='xs' align='center' line_height='0.24rem' className='risk-acceptance__text'>
                            {body_content}
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type='button' large text={button_text || localize('OK')} primary onClick={onClick} />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default RiskToleranceWarningModal;
