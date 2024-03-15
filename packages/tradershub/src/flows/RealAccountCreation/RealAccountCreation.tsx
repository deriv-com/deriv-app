import React, { Fragment, useState } from 'react';
import ReactModal from 'react-modal';
import { DesktopProgressBar, MobileProgressBar, TSteps } from '@/components';
import { CUSTOM_STYLES } from '@/helpers';
import { useQueryParams } from '@/hooks';
import { AccountOpeningSuccessModal, ExitConfirmationDialog } from '@/modals';
import { useRealAccountCreationContext } from '@/providers';
import { StandaloneXmarkBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import WizardScreens from './WizardScreens/WizardScreens';

const FORM_PROGRESS_STEPS: TSteps = ['Account currency', 'Personal details', 'Address', 'Terms of use'];

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
    const { currentStep } = useRealAccountCreationContext();
    const { isModalOpen } = useQueryParams();

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
