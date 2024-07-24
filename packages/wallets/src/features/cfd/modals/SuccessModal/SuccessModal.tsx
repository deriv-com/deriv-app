import React, { ComponentProps, FC } from 'react';
import { useActiveWalletAccount } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
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

    const buttonSize = isDesktop ? 'md' : 'lg';

    const renderButton = () => {
        return accountType === 'demo' ? (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={onSecondaryClick} size={buttonSize}>
                    OK
                </WalletButton>
            </div>
        ) : (
            <WalletButtonGroup isFlex isFullWidth>
                <WalletButton onClick={onSecondaryClick} size={buttonSize} variant='outlined'>
                    Maybe later
                </WalletButton>
                <WalletButton onClick={onPrimaryClick} size={buttonSize}>
                    Transfer funds
                </WalletButton>
            </WalletButtonGroup>
        );
    };

    if (isDesktop) {
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
    }

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
};

export default SuccessModal;
