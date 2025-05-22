import React, { ComponentProps } from 'react';
import { LabelPairedCircleExclamationCaptionRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Badge, Text } from '@deriv-com/ui';
import { DISABLED_PLATFORM_STATUSES, MT5_ACCOUNT_STATUS, TRADING_PLATFORM_STATUS } from '../../constants';

type TProps = {
    badgeSize: ComponentProps<typeof Badge>['badgeSize'];
    className?: ComponentProps<typeof Badge>['className'];
    status: (typeof DISABLED_PLATFORM_STATUSES)[number];
};

const getBadgeText = (status: TProps['status'], localize: (key: string) => string) => {
    switch (status) {
        case TRADING_PLATFORM_STATUS.MAINTENANCE:
        case MT5_ACCOUNT_STATUS.UNDER_MAINTENANCE:
            return localize('Server maintenance');
        case TRADING_PLATFORM_STATUS.UNAVAILABLE:
        case MT5_ACCOUNT_STATUS.UNAVAILABLE:
            return localize('Temporarily unavailable');
        default:
            return '';
    }
};

const PlatformStatusBadge: React.FC<TProps> = ({ badgeSize, className, status }) => {
    const { localize } = useTranslations();

    if (!getBadgeText(status, localize)) return null;

    return (
        <Badge
            badgeSize={badgeSize}
            className={className}
            color='warning-secondary'
            isBold
            leftIcon={<LabelPairedCircleExclamationCaptionRegularIcon fill='#C47D00' />}
            padding='loose'
            rounded='sm'
            variant='bordered'
        >
            <Text lineHeight='2xl' size='2xs' weight='bold'>
                {getBadgeText(status, localize)}
            </Text>
        </Badge>
    );
};

export default PlatformStatusBadge;
