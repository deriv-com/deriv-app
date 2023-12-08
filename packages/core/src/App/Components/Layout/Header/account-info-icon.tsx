import React from 'react';
import { Icon } from '@deriv/components';

type TAccountInfoIcon = {
    is_virtual?: boolean;
    currency?: string;
};

const AccountInfoIcon = ({ is_virtual, currency }: TAccountInfoIcon) => (
    <Icon
        data_testid='dt_icon'
        icon={`IcCurrency-${is_virtual ? 'virtual' : currency ?? 'Unknown'}`}
        className={`acc-info__id-icon acc-info__id-icon--${is_virtual ? 'virtual' : currency}`}
        size={24}
    />
);

export default AccountInfoIcon;
