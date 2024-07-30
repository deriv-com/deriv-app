import React, { ComponentProps } from 'react';
import { useTradingPlatformStatus } from '@deriv/api-v2';
import { LegacyWarningIcon } from '@deriv/quill-icons';
import { Badge } from '@deriv-com/ui';
import { WalletText } from '../../../../components/Base';
import { THooks } from '../../../../types';
import type { TAccount } from '../../../cashier/modules/Transfer/types';
import { TRADING_PLATFORM_STATUS } from '../../constants';

type TProps = {
    badgeSize: ComponentProps<typeof Badge>['badgeSize'];
    cashierAccount?: TAccount;
    className?: ComponentProps<typeof Badge>['className'];
    mt5Account?: THooks.MT5AccountsList;
};

const PlatformStatusBadge: React.FC<TProps> = ({ badgeSize, cashierAccount, className, mt5Account }) => {
    const { getPlatformStatus } = useTradingPlatformStatus();
    const platformStatus = getPlatformStatus(cashierAccount?.account_type ?? mt5Account?.platform ?? '');

    const isMaintenance = platformStatus === TRADING_PLATFORM_STATUS.MAINTENANCE;
    const isUnavailable = [mt5Account?.status, cashierAccount?.status].includes(TRADING_PLATFORM_STATUS.UNAVAILABLE);

    const getBadgeText = () => {
        if (isMaintenance) return 'Server maintenance';
        if (isUnavailable) return 'Unavailable';
        return '';
    };

    return (
        <Badge
            badgeSize={badgeSize}
            className={className}
            color='warning'
            isBold
            leftIcon={<LegacyWarningIcon iconSize='xs' />}
            padding='loose'
            rounded='sm'
            variant='bordered'
        >
            <WalletText color='warning' lineHeight='2xl' size='2xs' weight='bold'>
                <span style={{ color: 'var(--status-warning, #ffad3a)' }}>{getBadgeText()}</span>
            </WalletText>
        </Badge>
    );
};

export default PlatformStatusBadge;
