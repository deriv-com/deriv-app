import React, { ComponentProps } from 'react';
import classNames from 'classnames';
import {
    LabelPairedCircleExclamationCaptionBoldIcon,
    LabelPairedClockThreeCaptionBoldIcon,
    LabelPairedTriangleExclamationCaptionBoldIcon,
    LabelPairedTriangleExclamationSmBoldIcon,
} from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Badge, Text, useDevice } from '@deriv-com/ui';
import './WalletStatusBadge.scss';

const statusConfig = {
    disabled: {
        color: 'danger-secondary',
        icon: <LabelPairedTriangleExclamationSmBoldIcon fill='var(--du-badge-danger-secondary, #c40000)' />,
        text: <Localize i18n_default_text='Disabled' />,
    },
    failed: {
        color: 'danger-secondary',
        icon: <LabelPairedTriangleExclamationCaptionBoldIcon fill='#C40000' />,
        text: <Localize i18n_default_text='Failed' />,
    },
    needs_verification: {
        color: 'blue-secondary',
        icon: <LabelPairedCircleExclamationCaptionBoldIcon fill='#0777C4' />,
        text: <Localize i18n_default_text='Needs verification' />,
    },
    pending: {
        color: 'warning-secondary',
        icon: <LabelPairedClockThreeCaptionBoldIcon fill='#C47D00' />,
        text: <Localize i18n_default_text='In review' />,
    },
} as const;

type TStatus = keyof typeof statusConfig;

type TProps = Omit<ComponentProps<typeof Badge>, 'children'> & {
    onClick?: () => void;
    status: TStatus;
};

const WalletStatusBadge: React.FC<TProps> = ({
    badgeSize = 'sm',
    onClick,
    padding = 'loose',
    rounded = 'sm',
    status,
    textSize = 'xs',
    variant = 'bordered',
    ...rest
}) => {
    const { isDesktop } = useDevice();

    return (
        <Badge
            badgeSize={badgeSize}
            color={statusConfig[status].color}
            isBold
            leftIcon={statusConfig[status].icon}
            onClick={() => onClick?.()}
            padding={padding}
            rounded={rounded}
            textSize={textSize}
            variant={variant}
            {...rest}
        >
            {status === 'disabled' ? (
                statusConfig[status].text
            ) : (
                <Text
                    className={classNames({ 'wallets-status-badge--underlined': !!onClick })}
                    size={isDesktop ? 'xs' : 'sm'}
                    weight='bold'
                >
                    {statusConfig[status].text}
                </Text>
            )}
        </Badge>
    );
};

export default WalletStatusBadge;
