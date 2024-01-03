import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useBreakpoint, Button } from '@deriv/quill-design';
import { ButtonGroup } from '../../../../components/Base/ButtonGroup';
import { ModalStepWrapper } from '../../../../components/ModalStepWrapper';
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
                    <Button className='rounded-200' onClick={() => hide()} size='lg'>
                        Continue
                    </Button>
                </ButtonGroup>
            ) : (
                <ButtonGroup>
                    <Button
                        className='rounded-200'
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
        [hide, history]
    );

    const description = isDemo
        ? `Congratulations, you have successfully created your demo ${PlatformDetails.ctrader.title} CFDs account.`
        : `Congratulations, you have successfully created your real ${PlatformDetails.ctrader.title} CFDs account. To start trading, transfer funds from your Deriv account into this account.`;

    if (isMobile) {
        return (
            <ModalStepWrapper shouldHideHeader>
                <div className='max-w-[330px] p-800'>
                    <CFDSuccess
                        description={description}
                        platform={PlatformDetails.ctrader.platform}
                        renderButtons={renderButtons}
                    />
                </div>
            </ModalStepWrapper>
        );
    }

    return (
        <ModalStepWrapper shouldHideHeader>
            <div className='max-w-[440px] p-1200'>
                <CFDSuccess
                    description={description}
                    platform={PlatformDetails.ctrader.platform}
                    renderButtons={renderButtons}
                />
            </div>
        </ModalStepWrapper>
    );
};

export default CTraderSuccessModal;
