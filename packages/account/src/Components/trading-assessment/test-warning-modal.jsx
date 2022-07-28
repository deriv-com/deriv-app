import { Modal } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';

const TestWarningModal = ({ show_risk_modal, body_content, footer_content }) => {
    return (
        <Modal
            width='44rem'
            has_close_icon={false}
            title={localize('Appropriateness Test Warning')}
            is_open={show_risk_modal}
            className='risk-tolerance'
        >
            <Modal.Body>{body_content}</Modal.Body>
            <Modal.Footer>{footer_content}</Modal.Footer>
        </Modal>
    );
};

export default TestWarningModal;
