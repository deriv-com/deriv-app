import React, { MouseEventHandler } from 'react';
import { useQueryString } from '@/hooks';
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
    const { queryString } = useQueryString();
    const { advertId = '' } = queryString;
    const isEdit = !!advertId;
    return (
        <div className='p2p-v2-ad-form-controller'>
            <Button
                className='border-2'
                color='black'
                onClick={() => (onCancel ? onCancel() : goToPreviousStep())}
                size='lg'
                textSize={textSize}
                type='button'
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
                    type='button'
                    variant='contained'
                >
                    Next
                </Button>
            ) : (
                <Button size='lg' textSize={textSize}>
                    {`${isEdit ? 'Save changes' : 'Post ad'}`}
                </Button>
            )}
        </div>
    );
};

export default AdFormController;
