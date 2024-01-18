import React, { useCallback } from 'react';
import { Button } from '@deriv/quill-design';
import { useSignupWizardContext } from '../../../context/SignupWizardContext';

type TActions = {
    onSubmit: () => void;
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

const Actions: React.FC<TActions> = ({ onSubmit }) => {
    const {
        helpers: { canGoToPrevStep, goToNextStep, goToPrevStep },
    } = useSignupWizardContext();

    const handleSubmit = useCallback(() => {
        onSubmit?.();
        goToNextStep();
    }, [goToNextStep, onSubmit]);

    return (
        <div>
            <hr className='opacity-100' />
            <div className='flex justify-end divide-y-75 p-1200'>
                {canGoToPrevStep && (
                    <Button
                        className='mr-8 rounded-200 mr-400'
                        colorStyle='black'
                        onClick={goToPrevStep}
                        size='md'
                        variant='secondary'
                    >
                        Previous
                    </Button>
                )}
                <Button className='mr-8 rounded-200' onClick={handleSubmit} size='md' type='submit'>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Actions;
