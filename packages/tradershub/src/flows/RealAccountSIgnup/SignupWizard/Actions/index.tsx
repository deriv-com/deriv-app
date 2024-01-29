import React, { useCallback } from 'react';
import { useFormikContext } from 'formik';
import { Button } from '@deriv-com/ui/dist/components/Button';
import { useSignupWizardContext } from '../../../../providers/SignupWizardProvider';

type TActions = {
    canGoNext?: boolean;
};

/**
 * @name Actions
 * @description The Actions component is used to navigate between steps in the SignupWizard component.
 * @param {Function} onSubmit - A function that is called when the Next button is clicked.
 * @example
 * const onSubmit = () => {
 *     // do something
 * };
 * return (
 *     <Actions onSubmit={onSubmit} />
 * );
 */

const Actions: React.FC<TActions> = ({ canGoNext }) => {
    const {
        helpers: { canGoToPrevStep, goToNextStep, goToPrevStep },
    } = useSignupWizardContext();
    const { handleSubmit: handleFormikSubmit } = useFormikContext();

    const handleSubmit = useCallback(() => {
        handleFormikSubmit?.();
        goToNextStep();
    }, [goToNextStep, handleFormikSubmit]);

    return (
        <div>
            <hr className='opacity-100' />
            <div className='flex justify-end divide-y-75 p-1200'>
                {canGoToPrevStep && (
                    <Button className='mr-400' onClick={goToPrevStep} variant='outlined'>
                        Previous
                    </Button>
                )}
                <Button disabled={!canGoNext} onClick={handleSubmit} type='submit'>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Actions;
