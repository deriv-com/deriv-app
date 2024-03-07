/* eslint-disable sort-keys */
import React from 'react';
import {
    AccountsDerivXIcon as DerivX,
    AccountsDmt5CfdsIcon as Mt5Cfds,
    AccountsDmt5DerivedIcon as Mt5Derived,
    AccountsDmt5FinancialIcon as Mt5Financial,
    AccountsDmt5SwfIcon as Mt5Swf,
    IconTypes,
} from '@deriv/quill-icons';

const iconMapper: Record<string, IconTypes> = {
    DerivX,
    Mt5Cfds,
    Mt5Derived,
    Mt5Financial,
    Mt5Swf,
};

type TProps = {
    name: keyof typeof iconMapper;
    size: 'lg' | 'md' | 'sm' | 'xl';
};

const TradingAppIcon: React.FC<TProps> = ({ name, size }) => {
    const Icon = iconMapper[name];

    return <Icon iconSize={size} />;
};

export default TradingAppIcon;
