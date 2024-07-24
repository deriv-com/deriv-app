import React, { useCallback, useMemo } from 'react';
import { useDevice } from '@deriv-com/ui';
import { THooks } from '../../types';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../Base';
import { WalletCard } from '../WalletCard';
import { WalletSuccess } from '../WalletSuccess';

type TWalletAddedSuccessProps = {
    currency: THooks.CreateWallet['currency'];
    displayBalance: THooks.CreateWallet['display_balance'];
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
};

const WalletAddedSuccess: React.FC<TWalletAddedSuccessProps> = ({
    currency,
    displayBalance,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
}) => {
    const { isDesktop } = useDevice();
    const description = 'Make a deposit into your new Wallet.';
    const title = useMemo(() => `Your ${currency} wallet is ready`, [currency]);
    const renderFooter = useCallback(
        () => (
            <div className='wallets-add-more__success-footer'>
                <WalletButtonGroup isFlex isFullWidth>
                    <WalletButton onClick={onSecondaryButtonClick} variant='outlined'>
                        Maybe later
                    </WalletButton>
                    <WalletButton onClick={onPrimaryButtonClick}>Deposit</WalletButton>
                </WalletButtonGroup>
            </div>
        ),
        [onPrimaryButtonClick, onSecondaryButtonClick]
    );
    const renderIcon = useCallback(
        () => (
            <div className='wallets-add-more__success-card'>
                <WalletCard balance={displayBalance} currency={currency || 'USD'} />
            </div>
        ),
        [currency, displayBalance]
    );

    if (isDesktop)
        return (
            <ModalWrapper hideCloseButton>
                <WalletSuccess
                    description={description}
                    renderButtons={renderFooter}
                    renderIcon={renderIcon}
                    title={title}
                />
            </ModalWrapper>
        );

    return (
        <ModalStepWrapper renderFooter={renderFooter} title=''>
            <WalletSuccess description={description} renderIcon={renderIcon} title={title} />
        </ModalStepWrapper>
    );
};

export default WalletAddedSuccess;
