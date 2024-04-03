import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { ButtonGroup } from '@/components';
import { useQueryParams } from '@/hooks';
import { useUIContext } from '@/providers';
import { PlatformDetails } from '@cfd/constants';
import { CFDSuccess } from '@cfd/screens';
import { Button, Modal } from '@deriv-com/ui';

const CTraderSuccessModal = () => {
    const history = useHistory();
    const { uiState } = useUIContext();
    const { isModalOpen, closeModal } = useQueryParams();

    const isDemo = uiState.accountType === 'demo';

    const renderButtons = useCallback(
        () =>
            isDemo ? (
                <Button className='rounded-xs' onClick={closeModal} size='lg'>
                    Continue
                </Button>
            ) : (
                <ButtonGroup>
                    <Button
                        className='border-2 rounded-xs border-system-light-less-prominent'
                        color='black'
                        onClick={closeModal}
                        size='lg'
                        variant='outlined'
                    >
                        Maybe later
                    </Button>
                    <Button
                        className='rounded-xs'
                        onClick={() => {
                            closeModal();
                            history.push('/cashier/transfer');
                        }}
                        size='lg'
                    >
                        Transfer funds
                    </Button>
                </ButtonGroup>
            ),
        [closeModal, history, isDemo]
    );

    const description = isDemo
        ? `Congratulations, you have successfully created your demo ${PlatformDetails.ctrader.title} CFDs account.`
        : `Congratulations, you have successfully created your real ${PlatformDetails.ctrader.title} CFDs account. To start trading, transfer funds from your Deriv account into this account.`;

    return (
        <Modal isOpen={isModalOpen('CTraderSuccessModal')} onRequestClose={closeModal}>
            <Modal.Body className='max-w-[330px] p-16 md:max-w-[440px] md:p-24'>
                <CFDSuccess
                    description={description}
                    platform={PlatformDetails.ctrader.platform}
                    renderButtons={renderButtons}
                />
            </Modal.Body>
        </Modal>
    );
};

export default CTraderSuccessModal;
