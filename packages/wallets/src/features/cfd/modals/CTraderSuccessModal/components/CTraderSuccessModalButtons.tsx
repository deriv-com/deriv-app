import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { Button, useDevice } from '@deriv-com/ui';
import { WalletButtonGroup } from '../../../../../components';
import { THooks } from '../../../../../types';

type TCTraderSuccessModalButtons = {
    createdAccount?: THooks.CreateOtherCFDAccount;
    hide: () => void;
    isDemo?: boolean;
};

const CTraderSuccessModalButtons = ({ createdAccount, hide, isDemo }: TCTraderSuccessModalButtons) => {
    const history = useHistory();
    const { isDesktop } = useDevice();

    const walletButtonSizes = isDesktop ? 'md' : 'lg';

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <Button isFullWidth onClick={hide} size={walletButtonSizes} textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <Button
                borderWidth='sm'
                color='black'
                onClick={hide}
                size={walletButtonSizes}
                textSize='sm'
                variant='outlined'
            >
                <Localize i18n_default_text='Maybe later' />
            </Button>
            <Button
                onClick={() => {
                    hide();
                    history.push('/wallet/account-transfer', { toAccountLoginId: createdAccount?.account_id });
                }}
                size={walletButtonSizes}
                textSize='sm'
            >
                <Localize i18n_default_text='Transfer funds' />
            </Button>
        </WalletButtonGroup>
    );
};

export default CTraderSuccessModalButtons;
