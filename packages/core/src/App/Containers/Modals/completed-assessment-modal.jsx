import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import React from 'react';

const CompletedAssessmentModal = ({ should_show_assessment_complete_modal, setShouldShowAssessmentCompleteModal }) => {
    const handleOnClick = () => {
        setShouldShowAssessmentCompleteModal(false);
    };

    return (
        <Modal
            width='44rem'
            has_close_icon={false}
            className='center-risk-modal'
            is_open={should_show_assessment_complete_modal}
        >
            <Modal.Body>
                <Icon icon='IcVerificationSuccess' color='green' size={80} />
                <Text as='p' align='center' weight='bold' className='verified-account__text'>
                    <Localize i18n_default_text='Assessment Completed<0/><0/>' components={[<br key={0} />]} />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize
                        i18n_default_text='Thank you! Your response has been recorded into our system.<0/><0/>Please click ‘OK’ to continue.'
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={localize('OK')} primary onClick={handleOnClick} />
            </Modal.Footer>
        </Modal>
    );
};

export default connect(({ ui }) => ({
    should_show_assessment_complete_modal: ui.should_show_assessment_complete_modal,
    setShouldShowAssessmentCompleteModal: ui.setShouldShowAssessmentCompleteModal,
}))(CompletedAssessmentModal);
