import { Button, Icon, Modal, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import React from 'react';

const CompletedAssessmentModal = () => {
    return (
        <Modal width='4.4rem' has_close_icon={false} className='center-risk-modal'>
            <Modal.Body>
                <Icon icon='IcVerificationSuccess' size={80} />
                <Text as='p' size='s' align='center' weight='bold' className='verified-account__text'>
                    <Localize i18n_default_text='Assessment Completed<0/><0/>' components={[<br key={0} />]} />
                </Text>
                <Text as='p' size='xs' align='center'>
                    <Localize
                        i18n_default_text='Thank you! Your response has been recorded into our system.<0/><0/>Please click ‘OK’ to continue'
                        components={[<br key={0} />]}
                    />
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button type='button' large text={localize('OK')} primary />
            </Modal.Footer>
        </Modal>
    );
};

export default CompletedAssessmentModal;
