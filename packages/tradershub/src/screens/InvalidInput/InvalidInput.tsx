import React from 'react';
import { useLocation } from 'react-router-dom';
import ErrorIcon from '@/assets/svgs/error-icon.svg';
import { mapErrorDetails } from '@/helpers';
import { useQueryParams } from '@/hooks';
import { useRealAccountCreationContext } from '@/providers';
import { Button, Text } from '@deriv-com/ui';

const errorKeyMapping = {
    date_of_birth: 'dateOfBirth',
    first_name: 'firstName',
    last_name: 'lastName',
};

const betterName = {
    dateOfBirth: 'Date of Birth',
    firstName: 'First Name',
    lastName: 'Last Name',
};

const InvalidInput = () => {
    const { state: formState, helpers } = useRealAccountCreationContext();
    const { openModal } = useQueryParams();
    const { state } = useLocation();

    const errorDetails = state?.error?.details;

    const errorKeys = mapErrorDetails(errorDetails);

    const ErrorList = errorKeys.map(key => {
        const userInput = formState[key as keyof typeof formState];

        return (
            <li className='list-disc' key={key}>
                <Text size='sm'>
                    <span className='inline-block min-w-100'>
                        <strong>{betterName[key as keyof typeof betterName]}</strong>
                    </span>
                    : {userInput}
                </Text>
            </li>
        );
    });

    return (
        <div className='flex flex-col items-center justify-center gap-18 p-24 min-w-[400px]'>
            <ErrorIcon />
            <Text align='center' size='sm' weight='bold'>
                Invalid inputs
            </Text>
            <Text align='center' size='sm'>
                We don’t accept the following inputs for:{' '}
            </Text>
            <ul className='pl-4'>{ErrorList}</ul>
            <div className='mt-20'>
                <Button
                    onClick={() => {
                        helpers.setStep(1);
                        openModal('RealAccountCreation');
                    }}
                >
                    Lets try again
                </Button>
            </div>
        </div>
    );
};

export default InvalidInput;
