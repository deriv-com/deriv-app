import React, { useMemo } from 'react';
import { useTradingPlatformStatus } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { ClientVerificationStatusBadge } from '../../../../components';
import { getMarketTypeDetails, MARKET_TYPE, MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../../../constants';
import { TAddedMT5Account } from '../../../../types';

type TBadgeVariations = Partial<React.ComponentProps<typeof ClientVerificationStatusBadge>['variant']> | undefined;

const getClientKycStatus = (status: TAddedMT5Account['status']): TBadgeVariations => {
    switch (status) {
        case MT5_ACCOUNT_STATUS.POA_FAILED:
        case MT5_ACCOUNT_STATUS.PROOF_FAILED:
            return 'failed';
        case MT5_ACCOUNT_STATUS.VERIFICATION_PENDING:
            return 'in_review';
        case MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION:
            return 'needs_verification';
        default:
    }
};

const useAddedMT5Account = (account: TAddedMT5Account) => {
    const { localize } = useTranslations();
    const accountDetails = useMemo(
        () => getMarketTypeDetails(localize, account.product)[account.market_type ?? MARKET_TYPE.ALL],
        [account.market_type, account.product, localize]
    );

    const { getPlatformStatus } = useTradingPlatformStatus();
    const platformStatus = getPlatformStatus(account.platform);
    const kycStatus = getClientKycStatus(account.status);

    const isServerMaintenance =
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE ||
        account.status === MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE;

    const showPlatformStatus =
        account.status === MT5_ACCOUNT_STATUS.UNAVAILABLE ||
        account.status === MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE ||
        platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE;

    const showMT5TradeModal = platformStatus === TRADING_PLATFORM_STATUS.ACTIVE;

    return {
        accountDetails,
        isServerMaintenance,
        kycStatus,
        showMT5TradeModal,
        showPlatformStatus,
    };
};

export default useAddedMT5Account;
