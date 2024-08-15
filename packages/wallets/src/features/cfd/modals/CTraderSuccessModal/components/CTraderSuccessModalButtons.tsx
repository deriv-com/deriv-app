import React from 'react';
import { useHistory } from 'react-router-dom';
import { Localize } from '@deriv-com/translations';
import { WalletButton, WalletButtonGroup } from '../../../../../components';
import useDevice from '../../../../../hooks/useDevice';
import { THooks } from '../../../../../types';

type TCTraderSuccessModalButtons = {
    createdAccount?: THooks.CreateOtherCFDAccount;
    hide: () => void;
    isDemo: boolean;
};

const CTraderSuccessModalButtons = ({ createdAccount, hide, isDemo }: TCTraderSuccessModalButtons) => {
    const history = useHistory();
    const { isMobile } = useDevice();

    if (isDemo) {
        return (
            <div className='wallets-success-btn'>
                <WalletButton isFullWidth onClick={hide} size={isMobile ? 'lg' : 'md'}>
                    <Localize i18n_default_text='OK' />
                </WalletButton>
            </div>
        );
    }

    return (
        <WalletButtonGroup isFlex isFullWidth>
            <WalletButton onClick={hide} size={isMobile ? 'lg' : 'md'} variant='outlined'>
                <Localize i18n_default_text='Maybe later' />
            </WalletButton>
            <WalletButton
                onClick={() => {
                    hide();
                    history.push('/wallet/account-transfer', { toAccountLoginId: createdAccount?.account_id });
                }}
                size={isMobile ? 'lg' : 'md'}
            >
                <Localize i18n_default_text='Transfer funds' />
            </WalletButton>
        </WalletButtonGroup>
    );
};

export default CTraderSuccessModalButtons;
