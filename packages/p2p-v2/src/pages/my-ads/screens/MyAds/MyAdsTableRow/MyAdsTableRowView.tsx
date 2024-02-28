import React, { memo, useState } from 'react';
import { AdErrorTooltipModal } from '@/components/Modals';
import { getVisibilityErrorCodes } from '@/utils';
import { TMyAdsTableRowRendererProps } from '../MyAdsTable/MyAdsTable';
import MyAdsTableRow from './MyAdsTableRow';

const MyAdsTableRowView = ({
    balanceAvailable,
    dailyBuyLimit,
    dailySellLimit,
    isListed,
    ...rest
}: TMyAdsTableRowRendererProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { account_currency, remaining_amount, type, visibility_status = [] } = rest;

    return (
        <>
            <MyAdsTableRow isListed={isListed} setIsModalOpen={setIsModalOpen} {...rest} />
            {isModalOpen && (
                <AdErrorTooltipModal
                    accountCurrency={account_currency}
                    advertType={type}
                    balanceAvailable={balanceAvailable}
                    dailyBuyLimit={dailyBuyLimit}
                    dailySellLimit={dailySellLimit}
                    isModalOpen={isModalOpen}
                    onRequestClose={() => setIsModalOpen(false)}
                    remainingAmount={remaining_amount}
                    visibilityStatus={getVisibilityErrorCodes(visibility_status, true, isListed)}
                />
            )}
        </>
    );
};

export default memo(MyAdsTableRowView);
