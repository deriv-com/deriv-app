import React from 'react';
import { Badge } from '@deriv/components';
import { localize } from '@deriv/translations';

type TWalletBadge = {
    is_demo: boolean;
    label?: string;
};

const WalletBadge = ({ is_demo, label }: TWalletBadge) => {
    return is_demo ? (
        <Badge type='contained' background_color='blue' label={localize('Demo')} custom_color='colored-background' />
    ) : (
        <Badge type='bordered' label={label?.toUpperCase() ?? ''} />
    );
};

export default WalletBadge;
