import React, { useState } from 'react';
import { Text } from '@deriv-com/ui';
import { AccountClosureForm, AccountClosureSteps } from '../../containers';

export const AccountClosure = () => {
    const [step, setStep] = useState(1);

    const moveNext = () => {
        setStep(previous => previous + 1);
    };

    const moveBack = () => {
        setStep(previous => previous - 1);
    };

    if (step === 1) {
        return (
            <div>
                <Text as='h4' className='mb-16' size='sm' weight='bold'>
                    Are you sure?
                </Text>
                <AccountClosureSteps handleOnSubmit={moveNext} />
            </div>
        );
    }
    return (
        <div>
            <Text as='h4' className='mb-16' size='sm' weight='bold'>
                Please tell us why you&apos;re leaving. (Select up to 3 reasons.)
            </Text>
            <AccountClosureForm handleOnBack={moveBack} />
        </div>
    );
};
