import React, { MouseEventHandler } from 'react';
import { Button } from '@deriv-com/ui';
import './AdFormController.scss';

type TAdFormControllerProps = {
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: MouseEventHandler<HTMLButtonElement>;
    isNextButtonDisabled: boolean;
    onCancel: () => void;
};

const AdFormController = ({
    getCurrentStep,
    getTotalSteps,
    goToNextStep,
    goToPreviousStep,
    isNextButtonDisabled,
    onCancel,
}: TAdFormControllerProps) => {
    return (
        <div className='p2p-v2-ad-form-controller'>
            {getCurrentStep() === 1 && (
                <Button color='black' onClick={onCancel} variant='outlined'>
                    Cancel
                </Button>
            )}
            {getCurrentStep() > 1 && (
                <Button color='black' onClick={goToPreviousStep} variant='outlined'>
                    Previous
                </Button>
            )}

            {getCurrentStep() < getTotalSteps() ? (
                <Button disabled={isNextButtonDisabled} onClick={goToNextStep} variant='contained'>
                    Next
                </Button>
            ) : (
                <Button>Post ad</Button>
            )}
        </div>
    );
};

export default AdFormController;
