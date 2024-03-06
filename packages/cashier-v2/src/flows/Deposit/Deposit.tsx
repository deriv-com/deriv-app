import React, { useState } from 'react';
import { useActiveAccount } from '@deriv/api-v2';
import { CashierBreadcrumb, PageContainer } from '../../components';
import { CashierOnboardingModule, DepositCryptoModule, DepositFiatModule } from '../../lib';

const Deposit = () => {
    const { data: activeAccount } = useActiveAccount();
    const [isDeposit, setIsDeposit] = useState(false);
    const isCrypto = Boolean(activeAccount?.currency_config?.is_crypto);

    if (isDeposit) {
        return (
            <PageContainer>
                <CashierBreadcrumb isCrypto={isCrypto} setIsDeposit={setIsDeposit} />
                {isCrypto ? <DepositCryptoModule /> : <DepositFiatModule />}
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <CashierOnboardingModule setIsDeposit={setIsDeposit} />
        </PageContainer>
    );
};

export default Deposit;
