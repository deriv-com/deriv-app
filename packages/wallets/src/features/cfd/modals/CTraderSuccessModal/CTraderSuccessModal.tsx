import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { Loader, useDevice } from '@deriv-com/ui';
import { ModalStepWrapper, ModalWrapper } from '../../../../components';
import { useModal } from '../../../../components/ModalProvider';
import { THooks } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';
import { CTraderSuccessModalButtons } from './components';

type TCTraderSuccessModal = {
    createdAccount?: THooks.CreateOtherCFDAccount;
    isDemo: boolean;
    walletCurrencyType: THooks.WalletAccountsList['wallet_currency_type'];
};

const CTraderSuccessModal = ({ createdAccount, isDemo, walletCurrencyType }: TCTraderSuccessModal) => {
    const { data: cTraderAccounts, isLoading: isCtraderAccountsListLoading } = useCtraderAccountsList();
    const { isDesktop } = useDevice();
    const { hide } = useModal();

    const cTraderAccount = cTraderAccounts?.find(account => account.login);
    const isLoading = !cTraderAccounts || isCtraderAccountsListLoading || !cTraderAccount;

    if (isLoading) return <Loader />;

    const description = isDemo
        ? `Let's practise trading with ${cTraderAccount.display_balance} virtual funds.`
        : `Transfer funds from your ${walletCurrencyType} Wallet to your ${PlatformDetails.ctrader.title} account to start trading.`;

    if (isDesktop) {
        return (
            <ModalWrapper hideCloseButton>
                <CFDSuccess
                    description={description}
                    displayBalance={cTraderAccount.display_balance}
                    marketType='all'
                    platform={PlatformDetails.ctrader.platform}
                    renderButton={() => (
                        <CTraderSuccessModalButtons createdAccount={createdAccount} hide={hide} isDemo={isDemo} />
                    )}
                    title={`Your ${PlatformDetails.ctrader.title} ${isDemo ? 'demo' : ''} account is ready`}
                />
            </ModalWrapper>
        );
    }
    return (
        <ModalStepWrapper
            renderFooter={() => (
                <CTraderSuccessModalButtons createdAccount={createdAccount} hide={hide} isDemo={isDemo} />
            )}
            title={' '}
        >
            <CFDSuccess
                description={description}
                displayBalance={cTraderAccount.display_balance}
                marketType='all'
                platform='ctrader'
                renderButton={() => (
                    <CTraderSuccessModalButtons createdAccount={createdAccount} hide={hide} isDemo={isDemo} />
                )}
                title={`Your ${PlatformDetails.ctrader.title} ${isDemo ? 'demo' : ''} account is ready`}
            />
        </ModalStepWrapper>
    );
};

export default CTraderSuccessModal;
