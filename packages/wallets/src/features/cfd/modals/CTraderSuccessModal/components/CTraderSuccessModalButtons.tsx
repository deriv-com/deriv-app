import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { WalletButton, WalletButtonGroup } from '../../../../../components';
import { THooks } from '../../../../../types';

type TCTraderSuccessModalButtons = {
    createdAccount?: THooks.CreateOtherCFDAccount;
    hide: () => void;
    isDemo: boolean;
};

const CTraderSuccessModalButtons = ({ createdAccount, hide, isDemo }: TCTraderSuccessModalButtons) => {
    const history = useHistory();
    const { isDesktop } = useDevice();

    const walletButtonSizes = isDesktop ? 'md' : 'lg';

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={hide} size={walletButtonSizes}>
                    <Localize i18n_default_text='OK' />
                </WalletButton>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <WalletButton onClick={hide} size={walletButtonSizes} variant='outlined'>
                <Localize i18n_default_text='Maybe later' />
            </WalletButton>
            <WalletButton
                onClick={() => {
                    hide();
                    history.push('/wallet/account-transfer', { toAccountLoginId: createdAccount?.account_id });
                }}
                size={walletButtonSizes}
            >
                <Localize i18n_default_text='Transfer funds' />
            </WalletButton>
        </WalletButtonGroup>
    );
};

export default CTraderSuccessModalButtons;
