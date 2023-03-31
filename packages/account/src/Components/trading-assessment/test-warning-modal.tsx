import React from 'react';
import { DesktopWrapper, MobileDialog, MobileWrapper, Modal } from '@deriv/components';
import { localize } from '@deriv/translations';

type TTestWarningModal = {
    show_risk_modal: boolean;
    body_content: string;
    footer_content: string;
};

const TestWarningModal = ({ show_risk_modal, body_content, footer_content }: TTestWarningModal) => (
    <React.Fragment>
        <MobileWrapper>
            <MobileDialog
                wrapper_classname='test-warning'
                portal_element_id='modal_root'
                visible={show_risk_modal}
                title={localize('Appropriateness Test Warning')}
                has_close_icon={false}
            >
                <Modal.Body>{body_content}</Modal.Body>
                <Modal.Footer>{footer_content}</Modal.Footer>
            </MobileDialog>
        </MobileWrapper>
        <DesktopWrapper>
            <Modal
                width='44rem'
                has_close_icon={false}
                title={localize('Appropriateness Test Warning')}
                is_open={show_risk_modal}
            >
                <Modal.Body>{body_content}</Modal.Body>
                <Modal.Footer>{footer_content}</Modal.Footer>
            </Modal>
        </DesktopWrapper>
    </React.Fragment>
);

export default TestWarningModal;
