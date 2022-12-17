import React from 'react';
import { Icon } from '@deriv/components';
import { IconProps } from '../icon-types';

// TODO: This probably can be moved somewhere else.
export type Currency =
    | 'AUD'
    | 'BCH'
    | 'BTC'
    | 'BUSD'
    | 'DAI'
    | 'ETH'
    | 'EURCHECK'
    | 'EUR'
    | 'EURS'
    | 'EUSDT'
    | 'GBP'
    | 'IDK'
    | 'LTC'
    | 'PAX'
    | 'TUSD'
    | 'TUSDT'
    | 'UNKNOWN'
    | 'USD'
    | 'USDC'
    | 'USDK'
    | 'UST'
    | 'VIRTUAL';

const CurrencyIcon = ({ icon, ...props }: IconProps<Currency>) => {
    return <Icon icon={`IcCurrency${icon}`} {...props} />;
};

export default CurrencyIcon;
