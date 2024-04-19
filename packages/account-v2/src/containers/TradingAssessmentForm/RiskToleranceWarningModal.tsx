import React from 'react';
import { StandaloneTriangleExclamationFillIcon } from '@deriv/quill-icons';
import { Button, Modal, Text } from '@deriv-com/ui';
import { ACCOUNT_MODAL_REF } from '../../constants';
import { riskToleranceWarningModalConfig } from '../../modules/src/TradingAssessmentConfig';

type TRiskToleranceWarningModal = {
    handleSubmit: () => void;
    isModalOpen: boolean;
};

export const RiskToleranceWarningModal = ({ handleSubmit, isModalOpen }: TRiskToleranceWarningModal) => {
    Modal.setAppElement(ACCOUNT_MODAL_REF);
    return (
        <Modal className='md:w-[440px] sm:w-[312px]' isOpen={isModalOpen}>
            <Modal.Header className='py-0' hideCloseIcon>
                <Text as='h1' size='md' weight='bold'>
                    {riskToleranceWarningModalConfig.title}
                </Text>
            </Modal.Header>
            <Modal.Body className='flex flex-col mx-24'>
                <StandaloneTriangleExclamationFillIcon
                    className='self-center fill-status-light-danger'
                    iconSize='2xl'
                />
                <Text align='center' as='p' className='mt-10' size='sm'>
                    {riskToleranceWarningModalConfig.riskToleranceContent}
                </Text>
                <br />
                <Text align='center' as='p' className='mt-10' size='sm'>
                    {riskToleranceWarningModalConfig.continueMessage}
                </Text>
            </Modal.Body>
            <Modal.Footer className='mt-10 flex gap-x-16 justify-center' hideBorder>
                <Button color='primary' onClick={handleSubmit} rounded='sm'>
                    {riskToleranceWarningModalConfig.buttonText}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
