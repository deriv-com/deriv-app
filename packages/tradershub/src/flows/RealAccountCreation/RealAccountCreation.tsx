import React, { Fragment, useEffect, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import { DesktopProgressBar, MobileProgressBar } from '@/components';
import { CUSTOM_STYLES } from '@/helpers';
import { useQueryParams, useRegulationFlags } from '@/hooks';
import { AccountOpeningSuccessModal, ExitConfirmationDialog } from '@/modals';
import { useRealAccountCreationContext } from '@/providers';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import WizardScreens from './WizardScreens/WizardScreens';

/**
 * @name getFormSteps
 * @description The getFormSteps function is used to get the form steps based on the user's location.
 * @param {boolean} isEU - A boolean value to check if the user is in the EU.
 * @returns {string[]} - An array of strings representing the form steps.
 */
const getFormSteps = (isEU: boolean) => {
    const commonSteps = ['Account currency', 'Personal details', 'Address', 'Terms of use'];

    if (isEU) {
        return [...commonSteps.slice(0, 3), 'Trading assessment', 'Financial assessment', ...commonSteps.slice(3)];
    }
    return commonSteps;
};

/**
 * @name RealAccountCreation
 * @description The RealAccountCreation component is used to render the signup wizard modal.
 * @example
 * return (
 *  <RealAccountCreation />
 * );
 */
const RealAccountCreation = () => {
    const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
    const { currentStep, setTotalSteps } = useRealAccountCreationContext();
    const { isModalOpen } = useQueryParams();
    const { isEU } = useRegulationFlags();

    // Get the form steps based on the user's location
    const FORM_PROGRESS_STEPS = useMemo(() => getFormSteps(isEU), [isEU]);

    // Set the total steps in the progress bar based on the form steps
    useEffect(() => {
        if (FORM_PROGRESS_STEPS.length) {
            return setTotalSteps(FORM_PROGRESS_STEPS.length);
        }
    }, [FORM_PROGRESS_STEPS.length, setTotalSteps]);

    return (
        <Fragment>
            <ReactModal
                ariaHideApp={false}
                isOpen={isModalOpen('RealAccountCreation')}
                onRequestClose={() => setIsConfirmationDialogOpen(true)}
                shouldCloseOnOverlayClick={false}
                style={CUSTOM_STYLES}
            >
                <div className='bg-system-light-primary-background lg:max-h-[717px] lg:max-w-[1040px] h-screen w-screen lg:rounded-xl flex overflow-hidden'>
                    <div className='d-none lg:block min-w-[256px] bg-system-light-secondary-background p-24'>
                        <Text as='p' className='pt-32 pb-24 text-2xl' weight='bold'>
                            Add a Deriv Account
                        </Text>
                        <DesktopProgressBar activeStep={currentStep} steps={FORM_PROGRESS_STEPS} />
                        <StandaloneXmarkBoldIcon
                            className='absolute cursor-pointer right-24 top-24'
                            onClick={() => setIsConfirmationDialogOpen(true)}
                        />
                    </div>
                    <div className='flex flex-col justify-between w-full'>
                        <div className='lg:d-none'>
                            <MobileProgressBar
                                activeStep={currentStep}
                                onClickClose={() => setIsConfirmationDialogOpen(true)}
                                steps={FORM_PROGRESS_STEPS}
                            />
                        </div>
                        <WizardScreens />
                    </div>
                </div>
            </ReactModal>
            <ExitConfirmationDialog
                isOpen={isConfirmationDialogOpen}
                onClose={() => setIsConfirmationDialogOpen(false)}
            />
            <AccountOpeningSuccessModal />
        </Fragment>
    );
};

export default RealAccountCreation;
