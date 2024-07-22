import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveWalletAccount, useCreateOtherCFDAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard, WalletError } from '../../../../../components';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../constants';
import { CTraderSuccessModal } from '../../../modals/CTraderSuccessModal';

const AvailableCTraderAccountsList: React.FC = () => {
    const { hide, show } = useModal();
    const {
        data: createdAccount,
        error,
        isLoading: isCFDAccountCreationLoading,
        isSuccess: isCFDAccountCreationSuccess,
        mutate,
        status,
    } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { t } = useTranslation();

    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: PlatformDetails.ctrader.platform,
            },
        });
    };

    useEffect(() => {
        if (status === 'success') {
            show(
                <CTraderSuccessModal
                    createdAccount={createdAccount}
                    isDemo={accountType === 'demo'}
                    walletCurrencyType={activeWallet?.wallet_currency_type || 'USD'}
                />
            );
        }
        if (status === 'error') {
            show(
                <WalletError
                    errorMessage={error?.error?.message ?? 'Something went wrong. Please try again'}
                    onClick={() => hide()}
                    title={error?.error?.message ?? 'Error'}
                />
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountType, activeWallet?.wallet_currency_type, error?.error?.message, status]);

    return (
        <TradingAccountCard disabled={isCFDAccountCreationLoading || isCFDAccountCreationSuccess} onClick={onSubmit}>
            <TradingAccountCard.Icon>{PlatformDetails.ctrader.icon}</TradingAccountCard.Icon>
            <TradingAccountCard.Content>
                <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                <WalletText size='xs'>{t('CFDs on financial and derived instruments with copy trading.')}</WalletText>
            </TradingAccountCard.Content>
            <TradingAccountCard.Button>
                <LabelPairedChevronRightCaptionRegularIcon width={16} />
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export default AvailableCTraderAccountsList;
