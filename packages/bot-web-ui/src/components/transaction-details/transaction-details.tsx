import React, { Suspense } from 'react';
import { Loading } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const TransactionDetailsDesktop = React.lazy(
    () => import(/* webpackChunkName: "transaction-details-desktop" */ './transaction-details-desktop')
);

const TransactionDetailsMobile = React.lazy(
    () => import(/* webpackChunkName: "transaction-details-mobile" */ './transaction-details-mobile')
);

export default function TransactionDetails() {
    const is_mobile = isMobile();
    return (
        <Suspense fallback={<Loading />}>
            {is_mobile ? <TransactionDetailsMobile /> : <TransactionDetailsDesktop />}
        </Suspense>
    );
}
