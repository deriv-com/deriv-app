import React, { Suspense } from 'react';
import { Loading } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import TransactionDetailsDesktop from './transaction-details-desktop';
import TransactionDetailsMobile from './transaction-details-mobile';

export default function TransactionDetails() {
    const is_mobile = isMobile();
    return (
        <Suspense fallback={<Loading />}>
            {is_mobile ? <TransactionDetailsMobile /> : <TransactionDetailsDesktop />}
        </Suspense>
    );
}
