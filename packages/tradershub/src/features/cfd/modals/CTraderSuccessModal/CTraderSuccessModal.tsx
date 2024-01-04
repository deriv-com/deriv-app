import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useBreakpoint, Button } from '@deriv/quill-design';
import { ButtonGroup } from '../../../../components/Base/ButtonGroup';
import { Modal } from '../../../../components/Modal';
import { Provider } from '@deriv/library';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';

type TCTraderSuccessModal = {
    isDemo: boolean;
};

const CTraderSuccessModal = ({ isDemo }: TCTraderSuccessModal) => {
    const { isMobile } = useBreakpoint();
    const history = useHistory();
    const { hide } = Provider.useModal();

    const renderButtons = useCallback(
        () =>
            isDemo ? (
                <ButtonGroup>
                    <Button className='rounded-200 ' onClick={() => hide()} size='lg'>
                        Continue
                    </Button>
                </ButtonGroup>
            ) : (
                <ButtonGroup>
                    <Button
                        className='rounded-200 border-system-light-less-prominent border-100'
                        colorStyle='black'
                        onClick={() => hide()}
                        size='lg'
                        variant='secondary'
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

    if (isMobile) {
        return (
            <Modal className='max-w-[330px] p-800'>
                <CFDSuccess
                    description={description}
                    platform={PlatformDetails.ctrader.platform}
                    renderButtons={renderButtons}
                />
            </Modal>
        );
    }

    return (
        <Modal className='max-w-[440px] p-1200'>
            <CFDSuccess
                description={description}
                platform={PlatformDetails.ctrader.platform}
                renderButtons={renderButtons}
            />
        </Modal>
    );
};

export default CTraderSuccessModal;
