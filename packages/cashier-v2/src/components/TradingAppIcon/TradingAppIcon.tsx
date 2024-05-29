/* eslint-disable sort-keys */
import React from 'react';
import {
    AccountsDerivXIcon as DERIVX,
    AccountsDmt5DerivedIcon as DMT5_DERIVED,
    AccountsDmt5FinancialIcon as DMT5_FINANCIAL,
    AccountsDmt5SwfIcon as DMT5_ALL,
    IconTypes,
} from '@deriv/quill-icons';
import { TIconTypes } from '../../types';

const iconMapper: Record<string, IconTypes> = {
    DERIVX,
    DMT5_DERIVED,
    DMT5_FINANCIAL,
    DMT5_SYNTHETIC: DMT5_FINANCIAL,
    DMT5_ALL,
};

type TProps = {
    name: keyof typeof iconMapper;
    size: TIconTypes.TIconSize;
};

const TradingAppIcon: React.FC<TProps> = ({ name, size }) => {
    const Icon = iconMapper[name];

    return <Icon iconSize={size} />;
};

export default TradingAppIcon;
