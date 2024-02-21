import React from 'react';
import { useFormikContext } from 'formik';
import { ButtonGroup } from '@/components';
import { Button, Divider, useDevice } from '@deriv-com/ui';
import { useSignupWizardContext } from '../../../../providers/SignupWizardProvider';

type TActions = {
    isSubmitBtnLoading?: boolean;
    submitDisabled?: boolean;
};

/**
 * @name Actions
 * @description The Actions component is used to navigate between steps in the SignupWizard component.
 * Intended to be used as a child component of the Formik component.
 * @param {Object} props - React props object
 * @param {boolean} [props.submitDisabled] - A boolean that determines whether the Next button is disabled
 * @param {boolean} [props.isSubmitBtnLoading] - A boolean that determines whether the Next button is in a loading state
 * @example
 * return (
 *     <Actions submitDisabled />
 * );
 */

const Actions = ({ submitDisabled = false, isSubmitBtnLoading = false }: TActions) => {
    const {
        helpers: { canGoToNextStep, canGoToPrevStep, goToPrevStep },
    } = useSignupWizardContext();
    const { isSubmitting } = useFormikContext();
    const { isDesktop } = useDevice();

    return (
        <div>
            <Divider />
            <ButtonGroup className='p-24 sm:flex-row md:flex-row md:justify-end'>
                {canGoToPrevStep && (
                    <Button
                        disabled={isSubmitting || isSubmitBtnLoading}
                        isFullWidth={!isDesktop}
                        onClick={goToPrevStep}
                        size={isDesktop ? 'md' : 'lg'}
                        type='button'
                        variant='outlined'
                    >
                        Back
                    </Button>
                )}
                <Button
                    disabled={submitDisabled || isSubmitBtnLoading}
                    isFullWidth={!isDesktop}
                    isLoading={isSubmitting || isSubmitBtnLoading}
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
