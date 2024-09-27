import React from 'react';
import classNames from 'classnames';
import {
    LabelPairedCircleCheckCaptionBoldIcon,
    LabelPairedCircleExclamationCaptionBoldIcon,
    LabelPairedClockThreeCaptionBoldIcon,
    LabelPairedTriangleExclamationCaptionBoldIcon,
} from '@deriv/quill-icons';
import { Badge, Text, useDevice } from '@deriv-com/ui';
import './ClientVerificationStatusBadge.scss';

type TBadgeColor = React.ComponentProps<typeof Badge>['color'];

const badgeVariations = {
    failed: {
        color: 'danger-secondary',
        content: 'Failed',
        icon: <LabelPairedTriangleExclamationCaptionBoldIcon fill='#C40000' />,
    },
    in_review: {
        color: 'warning-secondary',
        content: 'In review',
        icon: <LabelPairedClockThreeCaptionBoldIcon fill='#C47D00' />,
    },
    needs_verification: {
        color: 'blue-secondary',
        content: 'Needs verification',
        icon: <LabelPairedCircleExclamationCaptionBoldIcon fill='#0777C4' />,
    },
    verified: {
        color: 'success-secondary',
        content: 'Verified',
        icon: <LabelPairedCircleCheckCaptionBoldIcon fill='#007A22' />,
    },
};

type TClientVerificationBadgeProps = {
    onClick?: VoidFunction;
    variant: keyof typeof badgeVariations;
};

const ClientVerificationStatusBadge: React.FC<TClientVerificationBadgeProps> = ({ onClick, variant }) => {
    const { isDesktop } = useDevice();
    const { color, content, icon } = badgeVariations[variant];
    return (
        <Badge
            badgeSize='sm'
            className='wallets-client-verification-badge'
            color={color as TBadgeColor}
            onClick={onClick}
        >
            {icon}
            <Text
                className={classNames('wallets-client-verification-badge__content', {
                    'wallets-client-verification-badge__content--underlined': !!onClick,
                })}
                size={isDesktop ? 'xs' : 'sm'}
                weight='bold'
            >
                {content}
            </Text>
        </Badge>
    );
};

export default ClientVerificationStatusBadge;
