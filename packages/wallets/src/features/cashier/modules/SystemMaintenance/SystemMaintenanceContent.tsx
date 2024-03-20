import React from 'react';
import { Trans } from 'react-i18next';
import { WalletText } from '../../../../components';

type TSystemMaintenanceDescProps = {
    currency?: string;
    isCashierLocked?: boolean;
    isCrypto?: boolean;
    isDepositLocked?: boolean;
    isWithdrawalLocked?: boolean;
};

const getSystemMaintenanceContent = ({
    currency,
    isCashierLocked,
    isCrypto,
    isDepositLocked,
    isWithdrawalLocked,
}: TSystemMaintenanceDescProps) => {
    if (isCashierLocked)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        defaults='Due to system maintenance, deposits and withdrawals with your {{currency}} Wallet are unavailable at the moment. Please try again later.'
                        values={{ currency }}
                    />
                </WalletText>
            ),
            title: (
                <Trans
                    defaults='{{currency}} Wallet deposits and withdrawals are temporarily unavailable.'
                    values={{ currency }}
                />
            ),
        };

    if (isCrypto && isDepositLocked)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        defaults='Due to system maintenance, deposits into your {{currency}} Wallet are unavailable at the moment. Please try again later.'
                        values={{ currency }}
                    />
                </WalletText>
            ),
            title: <Trans defaults='{{currency}} Wallet deposits are temporarily unavailable.' values={{ currency }} />,
        };

    if (isCrypto && isWithdrawalLocked)
        return {
            description: (
                <WalletText align='center'>
                    <Trans
                        defaults='Due to system maintenance, withdrawals from your {{currency}} Wallet are unavailable at the moment. Please try again later.'
                        values={{ currency }}
                    />
                </WalletText>
            ),
            title: (
                <Trans defaults='{{currency}} Wallet withdrawals are temporarily unavailable.' values={{ currency }} />
            ),
        };
};

export default getSystemMaintenanceContent;
