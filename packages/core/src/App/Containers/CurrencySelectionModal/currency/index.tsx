import React from 'react';
import { Icon } from '@deriv-lib/components';
import { capitalizeFirstLetter } from '@deriv-lib/shared';
import { IconProps } from '../types';

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
    return <Icon icon={`IcCurrency${capitalizeFirstLetter(icon.toLowerCase())}`} {...props} />;
};

export default CurrencyIcon;
