import React from 'react';
import { LabelPairedTriangleExclamationMdFillIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Badge } from '@deriv-com/ui';

type TStatus = 'disabled';

type TProps = {
    status: TStatus;
};

const statusConfig = {
    disabled: {
        color: 'danger',
        icon: <LabelPairedTriangleExclamationMdFillIcon fill='#EC3F3F' />,
        text: <Localize i18n_default_text='Disabled' />,
    },
} as const;

const WalletStatusBadge: React.FC<TProps> = ({ status }) => {
    return (
        <Badge
            badgeSize='sm'
            color={statusConfig[status].color}
            isBold
            leftIcon={statusConfig[status].icon}
            padding='loose'
            rounded='sm'
            textSize='xs'
            variant='bordered'
        >
            {statusConfig[status].text}
        </Badge>
    );
};

export default WalletStatusBadge;
