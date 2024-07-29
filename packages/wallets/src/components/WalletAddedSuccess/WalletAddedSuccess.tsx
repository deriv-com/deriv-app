import React, { useCallback, useMemo } from 'react';
import { useTranslations } from '@deriv-com/translations';
import useDevice from '../../hooks/useDevice';
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
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    const description = localize('Make a deposit into your new Wallet.');
    const title = useMemo(() => localize('Your {{currency}} wallet is ready', { currency }), [currency, localize]);
    const renderFooter = useCallback(
        () => (
            <div className='wallets-add-more__success-footer'>
                <WalletButtonGroup isFlex isFullWidth>
                    <WalletButton onClick={onSecondaryButtonClick} variant='outlined'>
                        {localize('Maybe later')}
                    </WalletButton>
                    <WalletButton onClick={onPrimaryButtonClick}>{localize('Deposit')}</WalletButton>
                </WalletButtonGroup>
            </div>
        ),
        [localize, onPrimaryButtonClick, onSecondaryButtonClick]
    );
    const renderIcon = useCallback(
        () => (
            <div className='wallets-add-more__success-card'>
                <WalletCard balance={displayBalance} currency={currency || 'USD'} />
            </div>
        ),
        [currency, displayBalance]
    );

    if (isMobile)
        return (
            <ModalStepWrapper renderFooter={renderFooter} title=''>
                <WalletSuccess description={description} renderIcon={renderIcon} title={title} />
            </ModalStepWrapper>
        );

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
};

export default WalletAddedSuccess;
