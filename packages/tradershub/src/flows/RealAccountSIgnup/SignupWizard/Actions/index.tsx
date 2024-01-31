import React, { useCallback } from 'react';
import { useFormikContext } from 'formik';
import { useBreakpoint } from '@deriv/quill-design';
import { Button } from '@deriv-com/ui';
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

const Actions = ({ canGoNext = true }: TActions) => {
    const {
        helpers: { canGoToNextStep, canGoToPrevStep, goToNextStep, goToPrevStep },
    } = useSignupWizardContext();
    const { handleSubmit: handleFormikSubmit } = useFormikContext();
    const { isMobile } = useBreakpoint();

    const handleSubmit = useCallback(() => {
        handleFormikSubmit?.();
        goToNextStep();
    }, [goToNextStep, handleFormikSubmit]);

    return (
        <div>
            <hr className='opacity-100' />
            <div className='flex justify-end divide-y-75 p-1200'>
                {canGoToPrevStep && (
                    <Button
                        className='mr-400'
                        isFullWidth={isMobile}
                        onClick={goToPrevStep}
                        size={isMobile ? 'lg' : 'md'}
                        variant='outlined'
                    >
                        Back
                    </Button>
                )}
                <Button
                    className='bg-solid-coral-700'
                    disabled={!canGoNext}
                    isFullWidth={isMobile}
                    onClick={handleSubmit}
                    size={isMobile ? 'lg' : 'md'}
                    type='submit'
                >
                    {canGoToNextStep ? 'Next' : 'Add account'}
                </Button>
            </div>
        </div>
    );
};

export default Actions;
