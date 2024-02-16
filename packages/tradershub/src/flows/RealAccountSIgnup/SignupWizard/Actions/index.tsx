import React from 'react';
import { useFormikContext } from 'formik';
import { ButtonGroup } from '@/components';
import { Button, Divider, useDevice } from '@deriv-com/ui';
import { useSignupWizardContext } from '../../../../providers/SignupWizardProvider';

type TActions = {
    submitDisabled?: boolean;
};

/**
 * @name Actions
 * @description The Actions component is used to navigate between steps in the SignupWizard component.
 * Intended to be used as a child component of the Formik component.
 * @param {Object} props - React props object
 * @param {boolean} [props.submitDisabled] - A boolean that determines whether the Next button is disabled
 * @example
 * return (
 *     <Actions submitDisabled />
 * );
 */

const Actions = ({ submitDisabled = false }: TActions) => {
    const {
        helpers: { canGoToNextStep, canGoToPrevStep, goToPrevStep },
    } = useSignupWizardContext();
    const { handleSubmit } = useFormikContext();
    const { isDesktop } = useDevice();

    return (
        <div>
            <Divider />
            <ButtonGroup className='flex-row justify-end p-24'>
                {canGoToPrevStep && (
                    <Button
                        isFullWidth={!isDesktop}
                        onClick={goToPrevStep}
                        size={isDesktop ? 'md' : 'lg'}
                        variant='outlined'
                    >
                        Back
                    </Button>
                )}
                <Button
                    disabled={submitDisabled}
                    isFullWidth={!isDesktop}
                    onClick={() => handleSubmit()}
                    size={isDesktop ? 'md' : 'lg'}
                    type='submit'
                >
                    {canGoToNextStep ? 'Next' : 'Add account'}
                </Button>
            </ButtonGroup>
        </div>
    );
};

export default Actions;
