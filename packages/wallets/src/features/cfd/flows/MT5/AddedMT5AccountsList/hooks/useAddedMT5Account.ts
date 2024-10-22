import React, { useMemo } from 'react';
import { useTradingPlatformStatus } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { THooks } from '../../../../../../types';
import { ClientVerificationStatusBadge } from '../../../../components';
import {
    CFD_PLATFORMS,
    DISABLED_PLATFORM_STATUSES,
    getMarketTypeDetails,
    MARKET_TYPE,
    MT5_ACCOUNT_STATUS,
    TRADING_PLATFORM_STATUS,
} from '../../../../constants';
import { TAddedMT5Account } from '../../../../types';

type TBadgeVariations = Partial<React.ComponentProps<typeof ClientVerificationStatusBadge>['variant']> | undefined;
type TPlatformStatus = THooks.TradingPlatformStatus[number]['status'];
type TDisabledPlatformStatus = typeof DISABLED_PLATFORM_STATUSES[number];

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

const getMT5PlatformStatus = (status: TAddedMT5Account['status'] | TPlatformStatus) => {
    switch (status) {
        case TRADING_PLATFORM_STATUS.ACTIVE:
            return 'active';
        case TRADING_PLATFORM_STATUS.UNAVAILABLE:
        case MT5_ACCOUNT_STATUS.UNAVAILABLE:
            return 'unavailable';
        case MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE:
            return 'under_maintenance';
        case TRADING_PLATFORM_STATUS.MAINTENANCE:
            return 'maintenance';
        default:
    }
};

const useAddedMT5Account = (account: TAddedMT5Account) => {
    const { localize } = useTranslations();

    // @ts-expect-error The enabled property exists, but the api-types are invalid
    const isAccountDisabled = 'rights' in account && !account.rights.enabled;

    const accountDetails = useMemo(
        () => getMarketTypeDetails(localize, account.product)[account.market_type ?? MARKET_TYPE.ALL],
        [account.market_type, account.product, localize]
    );

    const { getPlatformStatus } = useTradingPlatformStatus();
    const platformStatus = getMT5PlatformStatus(account.status || getPlatformStatus(CFD_PLATFORMS.MT5));
    const hasDisabledPlatformStatus = DISABLED_PLATFORM_STATUSES.includes(platformStatus as TDisabledPlatformStatus);

    const kycStatus = getClientKycStatus(account.status);

    const showMT5TradeModal = platformStatus === TRADING_PLATFORM_STATUS.ACTIVE;

    return {
        accountDetails,
        hasDisabledPlatformStatus,
        isAccountDisabled,
        kycStatus,
        platformStatus,
        showMT5TradeModal,
    };
};

export default useAddedMT5Account;
