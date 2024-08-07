import React, { useCallback, useMemo } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import { THooks } from '../../types';
import { ModalStepWrapper, ModalWrapper, WalletButtonGroup } from '../Base';
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
                    <Button color='black' onClick={onSecondaryButtonClick} variant='outlined'>
                        <Localize i18n_default_text='Maybe later' />
                    </Button>
                    <Button onClick={onPrimaryButtonClick}>
                        <Localize i18n_default_text='Deposit' />
                    </Button>
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
