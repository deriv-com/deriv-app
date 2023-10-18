import React from 'react';
import { Badge } from '@deriv/components';
import { localize } from '@deriv/translations';

type TWalletJurisdictionBadge = {
    is_demo: boolean;
    shortcode?: string;
};

const WalletJurisdictionBadge = ({ is_demo, shortcode }: TWalletJurisdictionBadge) => {
    return is_demo ? (
        <Badge type='contained' background_color='blue' label={localize('Demo')} />
    ) : (
        <Badge type='bordered' label={shortcode?.toUpperCase() ?? ''} />
    );
};

export default WalletJurisdictionBadge;
