import React from 'react';
import { Button, Modal, Text } from '@deriv-com/ui';
import { ACCOUNT_MODAL_REF } from '../../constants';
import { testWarningModalConfig } from '../../modules/src/TradingAssessmentConfig';

type TTestWarningModal = {
    handleSubmit: () => void;
    isModalOpen: boolean;
};

export const TestWarningModal = ({ handleSubmit, isModalOpen }: TTestWarningModal) => {
    Modal.setAppElement(ACCOUNT_MODAL_REF);
    return (
        <Modal className='md:w-[440px] sm:w-[312px]' isOpen={isModalOpen}>
            <Modal.Body className='flex flex-col mx-24'>
                <Text as='h1' className='my-16' size='md' weight='bold'>
                    {testWarningModalConfig.title}
                </Text>
                <Text as='p' className='mt-16' size='sm'>
                    {testWarningModalConfig.requireUsersInfoMessage}
                </Text>
                <br />
                <Text as='p' className='mt-10' size='sm'>
                    {testWarningModalConfig.insufficientKnowledgeMessage}
                </Text>
                <br />
                <Text as='p' className='mt-10' size='sm'>
                    {testWarningModalConfig.warnsUserMessage}
                </Text>
            </Modal.Body>
            <Modal.Footer className='mt-16 flex gap-x-16 justify-end' hideBorder>
                <Button color='primary' onClick={handleSubmit} rounded='sm' size='lg'>
                    <Text as='p' color='white' size='sm' weight='bold'>
                        {testWarningModalConfig.buttonText}
                    </Text>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
