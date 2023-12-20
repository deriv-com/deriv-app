import React from 'react';
import { usePOA, usePOI } from '@deriv/api';
import { Button, Text } from '@deriv/quill-design';
import { useModal } from '../../../../components/ModalProvider';

const getDocumentTitle = (isPOIFailed?: boolean, isPOAFailed?: boolean) => {
    if (isPOIFailed && isPOAFailed) return 'proof of identity and proof of address';
    if (isPOIFailed) return 'proof of identity';
    return 'proof of address';
};

const reasons = ['Document details do not match profile details', 'Expired documents', 'Poor image quality'];

const VerificationFailed = () => {
    const { hide } = useModal();
    const { data: poiStatus } = usePOI();
    const { data: poaStatus } = usePOA();

    const isPOIFailed = poiStatus?.is_rejected || poiStatus?.is_expired || poiStatus?.is_suspected;
    const isPOAFailed = poaStatus?.is_rejected || poaStatus?.is_expired || poaStatus?.is_suspected;

    return (
        <div className='flex flex-col p-1200 gap-1200 w-[440px] h-auto bg-system-light-primary-background rounded-400 sm:w-[320px] sm:p-800 sm:gap-800'>
            <Text bold size='sm'>
                Why did my verification fail?
            </Text>
            <Text size='sm'>
                Your {getDocumentTitle(isPOIFailed, isPOAFailed)} did not pass our verification checks. This could be
                due to reasons such as:
            </Text>
            <ul>
                {reasons.map(reason => (
                    <li className=' left-500 relative list-disc' key={reason}>
                        <Text size='sm'>{reason}</Text>
                    </li>
                ))}
            </ul>
            <Text size='sm'>
                Click <strong>Resubmit documents</strong> to find out more and submit your documents again.
            </Text>
            <div className='flex justify-end gap-400'>
                <Button colorStyle='black' onClick={() => hide()} variant='secondary'>
                    Maybe later
                </Button>
                <Button>Resubmit documents</Button>
            </div>
        </div>
    );
};

export default VerificationFailed;
