import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCtraderAccountsList } from '@deriv/api-v2';
import { ModalStepWrapper, ModalWrapper, WalletButton, WalletButtonGroup } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import useDevice from '../../../../hooks/useDevice';
import { THooks } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';

type TCTraderSuccessModal = {
    isDemo: boolean;
    walletCurrencyType: THooks.WalletAccountsList['wallet_currency_type'];
};

const CTraderSuccessModal = ({ isDemo, walletCurrencyType }: TCTraderSuccessModal) => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeWallet } = useActiveWalletAccount();
    const { isMobile } = useDevice();
    const history = useHistory();
    const { hide } = useModal();

    const renderButtons = useCallback(
        () =>
            isDemo ? (
                <div className='wallets-success-btn'>
                    <WalletButton isFullWidth onClick={hide} size='lg'>
                        OK
                    </WalletButton>
                </div>
            ) : (
                <WalletButtonGroup isFlex isFullWidth>
                    <WalletButton onClick={() => hide()} size='lg' variant='outlined'>
                        Maybe later
                    </WalletButton>
                    <WalletButton
                        onClick={() => {
                            hide();
                            history.push('/wallets/cashier/transfer');
                        }}
                        size='lg'
                    >
                        Transfer funds
                    </WalletButton>
                </WalletButtonGroup>
            ),
        [hide, history, isDemo]
    );

    const description = isDemo
        ? `Let's practise trading with ${activeWallet?.display_balance} virtual funds.`
        : `Transfer funds from your ${walletCurrencyType} Wallet to your ${PlatformDetails.ctrader.title} account to start trading.`;

    if (isMobile) {
        return (
            <ModalStepWrapper renderFooter={renderButtons} title={' '}>
                <CFDSuccess
                    description={description}
                    displayBalance={cTraderAccounts?.find(account => account.login)?.formatted_balance}
                    marketType='all'
                    platform='ctrader'
                    renderButton={renderButtons}
                    title={`Your ${PlatformDetails.ctrader.title} ${isDemo ? 'demo' : ''} account is ready`}
                />
                ;
            </ModalStepWrapper>
        );
    }
    return (
        <ModalWrapper>
            <CFDSuccess
                description={description}
                displayBalance={cTraderAccounts?.find(account => account.login)?.formatted_balance}
                marketType='all'
                platform={PlatformDetails.ctrader.platform}
                renderButton={renderButtons}
                title={`Your ${PlatformDetails.ctrader.title} ${isDemo ? 'demo' : ''} account is ready`}
            />
        </ModalWrapper>
    );
};

export default CTraderSuccessModal;
