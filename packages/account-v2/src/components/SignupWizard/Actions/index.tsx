import React from 'react';
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
        helpers: { canGoToPrevStep, goToPrevStep },
    } = useSignupWizardContext();

    return (
        <div className='flex justify-end divide-y-75'>
            {canGoToPrevStep && (
                <Button
                    className='btn btn--primary btn--medium mr-8 rounded-200 mr-400'
                    colorStyle='black'
                    onClick={goToPrevStep}
                    size='md'
                    variant='secondary'
                >
                    Previous
                </Button>
            )}
            <Button className='btn btn--primary btn--medium mr-8 rounded-200' onClick={onSubmit} size='md'>
                Next
            </Button>
        </div>
    );
};

export default Actions;
