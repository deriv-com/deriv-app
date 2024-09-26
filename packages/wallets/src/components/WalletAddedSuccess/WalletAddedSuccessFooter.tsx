import React from 'react';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { WalletButtonGroup } from '../Base';

type TWalletAddedSuccessFooterProps = {
    onPrimaryButtonClick: () => void;
    onSecondaryButtonClick: () => void;
};

const WalletAddedSuccessFooter = ({ onPrimaryButtonClick, onSecondaryButtonClick }: TWalletAddedSuccessFooterProps) => {
    const { isDesktop } = useDevice();
    return (
        <div className='wallets-add-more__success-footer'>
            <WalletButtonGroup isFlex isFullWidth>
                <Button
                    borderWidth='sm'
                    color='black'
                    onClick={onSecondaryButtonClick}
                    size={isDesktop ? 'md' : 'lg'}
                    textSize='sm'
                    variant='outlined'
                >
                    <Localize i18n_default_text='Maybe later' />
                </Button>
                <Button onClick={onPrimaryButtonClick} size={isDesktop ? 'md' : 'lg'} textSize='sm'>
                    <Localize i18n_default_text='Deposit' />
                </Button>
            </WalletButtonGroup>
        </div>
    );
};

export default WalletAddedSuccessFooter;
