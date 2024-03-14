import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ButtonGroup, Modal } from '@/components';
import { useModal } from '@/providers';
import { PlatformDetails } from '@cfd/constants';
import { CFDSuccess } from '@cfd/screens';
import { Button } from '@deriv-com/ui';

type TCTraderSuccessModal = {
    isDemo: boolean;
};

const CTraderSuccessModal = ({ isDemo }: TCTraderSuccessModal) => {
    const history = useHistory();
    const { hide } = useModal();

    const renderButtons = useCallback(
        () =>
            isDemo ? (
                <Button className='rounded-xs' onClick={() => hide()} size='lg'>
                    Continue
                </Button>
            ) : (
                <ButtonGroup>
                    <Button
                        className='border-2 rounded-xs border-system-light-less-prominent'
                        color='black'
                        onClick={() => hide()}
                        size='lg'
                        variant='outlined'
                    >
                        Maybe later
                    </Button>
                    <Button
                        className='rounded-xs'
                        onClick={() => {
                            hide();
                            history.push('/cashier/transfer');
                        }}
                        size='lg'
                    >
                        Transfer funds
                    </Button>
                </ButtonGroup>
            ),
        [hide, history, isDemo]
    );

    const description = isDemo
        ? `Congratulations, you have successfully created your demo ${PlatformDetails.ctrader.title} CFDs account.`
        : `Congratulations, you have successfully created your real ${PlatformDetails.ctrader.title} CFDs account. To start trading, transfer funds from your Deriv account into this account.`;

    return (
        <Modal className='max-w-[330px] p-16 md:max-w-[440px] md:p-24'>
            <CFDSuccess
                description={description}
                platform={PlatformDetails.ctrader.platform}
                renderButtons={renderButtons}
            />
        </Modal>
    );
};

export default CTraderSuccessModal;
