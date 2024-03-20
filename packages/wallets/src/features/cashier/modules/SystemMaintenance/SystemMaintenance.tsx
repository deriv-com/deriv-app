import React from 'react';
import { useAccountStatus, useActiveWalletAccount, useCashierValidation } from '@deriv/api-v2';
import { WalletsActionScreen } from '../../../../components';
import getSystemMaintenanceContent from './SystemMaintenanceContent';
import './SystemMaintenance.scss';

type TSystemMaintenanceProps = {
    children?: React.ReactNode;
    isDeposit?: boolean;
    isWithdrawal?: boolean;
};

const SystemMaintenance: React.FC<TSystemMaintenanceProps> = ({
    children,
    isDeposit = false,
    isWithdrawal = false,
}) => {
    const { data: activeWallet } = useActiveWalletAccount();
    const { data: cashierValidation } = useCashierValidation();
    const { data: status } = useAccountStatus();

    const currency = activeWallet?.currency || 'USD';
    const isVirtual = activeWallet?.is_virtual;
    const isCrypto = activeWallet?.is_crypto;

    const isDepositLocked = status?.is_deposit_locked && isDeposit;
    const isWithdrawalLocked = status?.is_withdrawal_locked && isWithdrawal;
    const isCashierLocked = status?.is_cashier_locked;

    const isSystemMaintenance = cashierValidation?.system_maintenance && !isVirtual;

    const systemMaintenanceContent = getSystemMaintenanceContent({
        currency,
        isCashierLocked,
        isCrypto,
        isDepositLocked,
        isWithdrawalLocked,
    });

    if (!isSystemMaintenance || (!systemMaintenanceContent?.description && !systemMaintenanceContent?.title)) {
        return <>{children}</>;
    }

    return (
        <div className='wallets-system-maintenance'>
            <WalletsActionScreen
                description={systemMaintenanceContent?.description}
                title={systemMaintenanceContent?.title}
            />
        </div>
    );
};

export default SystemMaintenance;
