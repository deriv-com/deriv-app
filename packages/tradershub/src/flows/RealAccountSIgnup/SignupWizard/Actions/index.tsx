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
 * Intended to be used as a child component of the Formik component.
 * @param {Object} props - React props object
 * @param {boolean} [props.canGoNext] - A boolean that determines whether the Next button is disabled
 * @example
 * return (
 *     <Actions canGoNext />
 * );
 */

const Actions = ({ canGoNext }: TActions) => {
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
