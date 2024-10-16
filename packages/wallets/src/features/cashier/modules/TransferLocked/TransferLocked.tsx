import React from 'react';
import { useAccountStatus, useActiveWalletAccount, useCashierValidation } from '@deriv/api-v2';
import { Localize } from '@deriv-com/translations';
import { ActionScreen, Loader, Text } from '@deriv-com/ui';
import { WalletLink } from '../../../../components';
import './TransferLocked.scss';

type TCashierLockedProps = {
    children?: React.ReactNode;
};

const TransferLocked: React.FC<TCashierLockedProps> = ({ children }) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: cashierValidation } = useCashierValidation();
    const { data: accountStatus, isLoading: accountStatusLoading } = useAccountStatus();

    const currency = activeWallet?.currency || 'USD';
    const askFinancialRiskApproval = cashierValidation?.ask_financial_risk_approval;
    const financialInformationNotComplete = accountStatus?.is_financial_information_not_complete;
    const tradingExperienceNotComplete = accountStatus?.is_trading_experience_not_complete;
    const isMFTransferLocked =
        activeWallet?.loginid?.startsWith('MF') &&
        (financialInformationNotComplete || tradingExperienceNotComplete) &&
        askFinancialRiskApproval;

    if (accountStatusLoading) {
        return <Loader />;
    }

    if (isMFTransferLocked) {
        return (
            <div className='wallets-transfer-locked'>
                <ActionScreen
                    description={
                        <Text align='center'>
                            <Localize
                                components={[
                                    <WalletLink href='/account/financial-assessment' key={0} variant='bold' />,
                                ]}
                                i18n_default_text='To enable transfers, you must complete the <0>financial assessment form</0>.'
                            />
                        </Text>
                    }
                    title={
                        <Localize
                            i18n_default_text='Transfers from your {{currency}} Wallet are temporarily locked.'
                            values={{ currency }}
                        />
                    }
                />
            </div>
        );
    }

    return <>{children}</>;
};

export default TransferLocked;
