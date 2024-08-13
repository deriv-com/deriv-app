import React, { ComponentProps, FC } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { Button, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../../../../components';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';

type TProps = Omit<ComponentProps<typeof CFDSuccess>, 'title'> & {
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
};

const SuccessModal: FC<TProps> = ({
    description,
    displayBalance = '',
    marketType = 'all',
    onPrimaryClick,
    onSecondaryClick,
    platform = 'dxtrade',
}) => {
    const { isDesktop } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';
    const title = `Your ${PlatformDetails[platform].title}${
        accountType === 'demo' ? ` ${accountType}` : ''
    } account is ready`;

    const renderButton = () => {
        return accountType === 'demo' ? (
            <div className='wallets-success-btn'>
                <Button isFullWidth onClick={onSecondaryClick} size={isDesktop ? 'md' : 'lg'}>
                    OK
                </Button>
            </div>
        ) : (
            <WalletButtonGroup isFlex isFullWidth>
                <Button color='black' onClick={onSecondaryClick} size={isDesktop ? 'md' : 'lg'} variant='outlined'>
                    Maybe later
                </Button>
                <Button onClick={onPrimaryClick} size={isDesktop ? 'md' : 'lg'}>
                    Transfer funds
                </Button>
            </WalletButtonGroup>
        );
    };

    if (!isDesktop) {
        return (
            <ModalStepWrapper renderFooter={renderButton} title={' '}>
                <CFDSuccess
                    description={description}
                    displayBalance={displayBalance}
                    marketType={marketType}
                    platform={platform}
                    title={title}
                />
            </ModalStepWrapper>
        );
    }

    return (
        <ModalWrapper hideCloseButton>
            <CFDSuccess
                description={description}
                displayBalance={displayBalance}
                marketType={marketType}
                platform={platform}
                renderButton={renderButton}
                title={title}
            />
        </ModalWrapper>
    );
};

export default SuccessModal;
