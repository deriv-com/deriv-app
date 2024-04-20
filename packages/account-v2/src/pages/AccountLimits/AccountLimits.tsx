import React from 'react';
import { useAccountLimits, useActiveAccount } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { AccountLimitsSideNote } from 'src/containers';
import { AccountLimitsTable } from 'src/containers/AccountLimitsContainer/AccountLimitsTable';
import { DemoMessage } from '../../components/DemoMessage';
import { getAccountLimitValues } from '../../utils/accountLimitsUtils';

export const AccountLimits = () => {
    const { data: accountLimits, isLoading } = useAccountLimits();
    const { data: activeAccount } = useActiveAccount();
    const currency = activeAccount?.currency;
    const isVirtual = activeAccount?.is_virtual;

    if (isLoading) return <Loader isFullScreen={false} />;

    if (isVirtual) {
        return <DemoMessage className='items-center' />;
    }

    if (accountLimits) {
        const tableData = getAccountLimitValues(accountLimits, currency);
        return (
            <div className='grid md:grid-cols-[auto,256px] gap-16'>
                <AccountLimitsTable accountLimitValues={tableData} />
                <AccountLimitsSideNote />
            </div>
        );
    }
    return null;
};
