import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Provider } from '@deriv/library';
import { Button } from '@deriv-com/ui';
import { ButtonGroup, Modal } from '../../../../components';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';

type TCTraderSuccessModal = {
    isDemo: boolean;
};

const CTraderSuccessModal = ({ isDemo }: TCTraderSuccessModal) => {
    const history = useHistory();
    const { hide } = Provider.useModal();

    const renderButtons = useCallback(
        () =>
            isDemo ? (
                <Button className='rounded-200 ' onClick={() => hide()} size='lg'>
                    Continue
                </Button>
            ) : (
                <ButtonGroup>
                    <Button
                        className='rounded-200 border-system-light-less-prominent border-100'
                        onClick={() => hide()}
                        size='lg'
                        variant='outlined'
                    >
                        Maybe later
                    </Button>
                    <Button
                        className='rounded-200'
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
        <Modal className='max-w-[330px] p-800 md:max-w-[440px] md:p-1200'>
            <CFDSuccess
                description={description}
                platform={PlatformDetails.ctrader.platform}
                renderButtons={renderButtons}
            />
        </Modal>
    );
};

export default CTraderSuccessModal;
