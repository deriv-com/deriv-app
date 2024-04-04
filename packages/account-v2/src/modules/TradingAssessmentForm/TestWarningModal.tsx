import React from 'react';
import { Button, Modal, Text } from '@deriv-com/ui';
import { ACCOUNT_MODAL_REF } from '../../constants';

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
                    Appropriateness Test Warning
                </Text>
                <Text as='p' className='mt-16' size='sm'>
                    In providing our services to you, we are required to ask you for some information to assess if a
                    given product or service is appropriate for you and whether you have the experience and knowledge to
                    understand the risks involved.
                </Text>
                <br />
                <Text as='p' className='mt-10' size='sm'>
                    Based on your answers, it looks like you have insufficient knowledge and experience in trading CFDs.
                    CFD trading is risky and you could potentially lose all of your capital.
                </Text>
                <br />
                <Text as='p' className='mt-10' size='sm'>
                    Please note that by clicking ‘OK’, you may be exposing yourself to risks. You may not have the
                    knowledge or experience to properly assess or mitigate these risks, which may be significant,
                    including the risk of losing the entire sum you have invested.
                </Text>
            </Modal.Body>
            <Modal.Footer className='mt-16 flex gap-x-16 justify-end' hideBorder>
                <Button color='primary' onClick={handleSubmit} rounded='sm' size='lg'>
                    <Text as='p' color='white' size='sm' weight='bold'>
                        OK
                    </Text>
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
