import React, { useCallback, useMemo } from 'react';
import useDevice from '../../hooks/useDevice';
import { THooks } from '../../types';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../Base';
import { WalletCard } from '../WalletCard';
import { WalletSuccess } from '../WalletSuccess';

type TWalletAddedSuccessProps = {
    currency: THooks.CreateWallet['currency'];
    displayBalance: THooks.CreateWallet['display_balance'];
    landingCompany: THooks.CreateWallet['landing_company_shortcode'];
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
};

const WalletAddedSuccess: React.FC<TWalletAddedSuccessProps> = ({
    currency,
    displayBalance,
    landingCompany,
    onPrimaryButtonClick,
    onSecondaryButtonClick,
}) => {
    const { isMobile } = useDevice();
    const description = 'Make a deposit into your new Wallet.';
    const title = useMemo(
        () => `Your ${currency} wallet (${landingCompany?.toUpperCase()}) is ready`,
        [currency, landingCompany]
    );
    const renderFooter = useCallback(
        () => (
            <div className='wallets-add-more__success-footer'>
                <WalletButtonGroup isFlex isFullWidth>
                    <WalletButton onClick={onSecondaryButtonClick} text='Maybe later' variant='outlined' />
                    <WalletButton onClick={onPrimaryButtonClick} text='Deposit' />
                </WalletButtonGroup>
            </div>
        ),
        [onPrimaryButtonClick, onSecondaryButtonClick]
    );
    const renderIcon = useCallback(
        () => (
            <div className='wallets-add-more__success-card'>
                <WalletCard balance={displayBalance} currency={currency || 'USD'} landingCompanyName={landingCompany} />
            </div>
        ),
        [currency, displayBalance, landingCompany]
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
