import React from 'react';
import { Loader } from '@deriv-com/ui';
import { AccountLimitsSideNote } from 'src/containers';
import { AccountLimitsTable } from 'src/containers/AccountLimitsContainer/AccountLimitsTable';
import { DemoMessage } from '../../components/DemoMessage';
import { useAccountLimitsData } from '../../hooks';

export const AccountLimits = () => {
    const { accountLimits, isLoading, isVirtual } = useAccountLimitsData();
    if (isLoading) return <Loader isFullScreen={false} />;

    if (isVirtual) {
        return <DemoMessage className='items-center' />;
    }

    if (accountLimits?.length) {
        return (
            <div className='flex flex-col-reverse md:grid md:grid-cols-[auto,256px] gap-16'>
                <AccountLimitsTable accountLimitValues={accountLimits} />
                <AccountLimitsSideNote />
            </div>
        );
    }
    return null;
};
