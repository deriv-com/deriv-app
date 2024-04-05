import React, { MouseEventHandler } from 'react';
import { Button, useDevice } from '@deriv-com/ui';
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
    const { isMobile } = useDevice();
    const textSize = isMobile ? 'md' : 'sm';
    return (
        <div className='p2p-v2-ad-form-controller'>
            <Button
                color='black'
                onClick={() => (onCancel ? onCancel() : goToPreviousStep())}
                size='lg'
                textSize={textSize}
                variant='outlined'
            >
                {onCancel ? 'Cancel' : 'Previous'}
            </Button>
            {getCurrentStep() < getTotalSteps() ? (
                <Button
                    disabled={isNextButtonDisabled}
                    onClick={goToNextStep}
                    size='lg'
                    textSize={textSize}
                    variant='contained'
                >
                    Next
                </Button>
            ) : (
                <Button size='lg' textSize={textSize}>
                    Post ad
                </Button>
            )}
        </div>
    );
};

export default AdFormController;
