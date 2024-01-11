import React from 'react';
import { Provider } from '@deriv/library';
import { Button, Text } from '@deriv/quill-design';

const reasons = ['Proof of identity', 'Proof of address'];

/**
 * @description This component is used to display the verification failed modal in case of POI and POA
 */

const VerificationFailed = () => {
    const { hide } = Provider.useModal();

    return (
        <div className='flex flex-col w-[320px] p-800 gap-800 h-auto bg-system-light-primary-background rounded-400 lg:p-1200 lg:gap-1200 lg:w-[440px]'>
            <Text bold>Why did my verification fail?</Text>
            <Text size='sm'>The following documents you submitted did not pass our checks:</Text>
            <ul>
                {reasons.map(reason => (
                    <li className='relative list-disc  left-500' key={reason}>
                        <Text size='sm'>{reason}</Text>
                    </li>
                ))}
            </ul>
            <Text size='sm'>If you’d like to get the MT5 CFDs account, resubmit these documents.</Text>
            <div className='flex justify-end gap-400'>
                <Button
                    className='border-opacity-black-400 rounded-200 px-800'
                    colorStyle='black'
                    onClick={() => hide()}
                    variant='secondary'
                >
                    Maybe later
                </Button>
                <Button className='rounded-200 px-800'>Resubmit documents</Button>
            </div>
        </div>
    );
};

export default VerificationFailed;
