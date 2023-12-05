import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useCtraderAccountsList } from '@deriv/api';
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
    const { isMobile } = useDevice();
    const history = useHistory();
    const { hide } = useModal();

    const renderButtons = useCallback(
        () => (
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
        [hide, history]
    );

    const description = isDemo
        ? `Transfer virtual funds from your Demo Wallet to your ${PlatformDetails.ctrader.title} Demo account to practice trading.`
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
