import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import { WalletButtonGroup } from '../Base';

type TWalletAddedSuccessFooterProps = {
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
};

const WalletAddedSuccessFooter = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TWalletAddedSuccessFooterProps) => {
    return (
        <div className='wallets-add-more__success-footer'>
            <WalletButtonGroup isFlex isFullWidth>
                <Button borderWidth='sm' color='black' onClick={onSecondaryButtonClick} variant='outlined'>
                    <Localize i18n_default_text='Maybe later' />
                </Button>
                <Button onClick={onPrimaryButtonClick}>
                    <Localize i18n_default_text='Deposit' />
                </Button>
            </WalletButtonGroup>
        </div>
    );
};

export default WalletAddedSuccessFooter;
