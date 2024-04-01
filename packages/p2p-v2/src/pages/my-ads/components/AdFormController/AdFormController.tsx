import React, { MouseEventHandler } from 'react';
import { Button } from '@deriv-com/ui';
import './AdFormController.scss';

type TAdFormControllerProps = {
    getCurrentStep: () => number;
    getTotalSteps: () => number;
    goToNextStep: MouseEventHandler<HTMLButtonElement>;
    goToPreviousStep: () => void;
    isNextButtonDisabled: boolean;
    onCancel?: () => void;
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
            <Button color='black' onClick={() => (onCancel ? onCancel() : goToPreviousStep())} variant='outlined'>
                {onCancel ? 'Cancel' : 'Previous'}
            </Button>
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
