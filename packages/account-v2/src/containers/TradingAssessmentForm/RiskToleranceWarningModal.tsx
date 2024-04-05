import React from 'react';
import { StandaloneTriangleExclamationFillIcon } from '@deriv/quill-icons';
import { Button, Modal, Text } from '@deriv-com/ui';
import { ACCOUNT_MODAL_REF } from '../../constants';

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
                    Risk Tolerance Warning
                </Text>
            </Modal.Header>
            <Modal.Body className='flex flex-col mx-24'>
                <StandaloneTriangleExclamationFillIcon
                    className='self-center fill-status-light-danger'
                    iconSize='2xl'
                />
                <Text align='center' as='p' className='mt-10' size='sm'>
                    CFDs and other financial instruments come with a high risk of losing money rapidly due to leverage.
                    You should consider whether you understand how CFDs and other financial instruments work and whether
                    you can afford to take the high risk of losing your money.
                </Text>
                <br />
                <Text align='center' as='p' className='mt-10' size='sm'>
                    To continue, you must confirm that you understand your capital is at risk.
                </Text>
            </Modal.Body>
            <Modal.Footer className='mt-10 flex gap-x-16 justify-center' hideBorder>
                <Button color='primary' onClick={handleSubmit} rounded='sm'>
                    Yes, I understand the risk.
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
