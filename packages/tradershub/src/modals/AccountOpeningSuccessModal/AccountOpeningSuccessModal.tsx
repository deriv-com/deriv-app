import React from 'react';
import ReactModal from 'react-modal';
import { useHistory } from 'react-router-dom';
import Checkmark from '@/assets/svgs/checkmark.svg';
import { ActionScreen, ButtonGroup, IconComponent } from '@/components';
import { CUSTOM_STYLES } from '@/helpers';
import { useQueryParams } from '@/hooks';
import { useRealAccountCreationContext } from '@/providers';
import { Button, Text, useDevice } from '@deriv-com/ui';

const SelectedCurrencyIcon = () => {
    const { state } = useRealAccountCreationContext();
    return (
        <div className='relative'>
            <IconComponent
                className='flex items-center justify-center'
                height={80}
                icon={state.currency ?? 'USD'}
                width={80}
            />
            <Checkmark className='absolute w-32 h-32 bottom-0 right-[-4px]' />
        </div>
    );
};

const AccountOpeningSuccessModal = () => {
    const { isSuccessModalOpen, reset } = useRealAccountCreationContext();
    const { isDesktop } = useDevice();
    const { state } = useRealAccountCreationContext();
    const history = useHistory();
    const { closeModal } = useQueryParams();

    const handleNavigateToDeposit = () => {
        reset();
        closeModal();
        history.push('/cashier/deposit');
    };

    return (
        <ReactModal
            ariaHideApp={false}
            className='modal'
            isOpen={isSuccessModalOpen}
            shouldCloseOnEsc={false}
            shouldCloseOnOverlayClick={false}
            style={CUSTOM_STYLES}
        >
            <ActionScreen
                className='bg-system-light-primary-background h-screen w-screen lg:h-[304px] lg:w-[440px] lg:rounded-default p-16 lg:p-0'
                description={
                    <div className='text-center'>
                        <Text align='center' as='p' className='text-sm lg:text-default'>
                            You have added a {state.currency} account.
                        </Text>
                        <Text align='center' as='p' className='text-sm lg:text-default'>
                            Make a deposit now to start trading.
                        </Text>
                    </div>
                }
                icon={<SelectedCurrencyIcon />}
                renderButtons={() => (
                    <ButtonGroup className='flex-col lg:flex-row sm:w-full'>
                        <Button
                            color='black'
                            isFullWidth={!isDesktop}
                            onClick={closeModal}
                            size='md'
                            variant='outlined'
                        >
                            Maybe later
                        </Button>
                        <Button isFullWidth={!isDesktop} onClick={handleNavigateToDeposit} size='md'>
                            Deposit
                        </Button>
                    </ButtonGroup>
                )}
                title='Your account is ready'
            />
        </ReactModal>
    );
};

export default AccountOpeningSuccessModal;
