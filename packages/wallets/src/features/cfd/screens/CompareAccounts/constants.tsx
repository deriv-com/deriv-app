import React from 'react';
import {
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
} from '@deriv/quill-icons';
import { CFD_PLATFORMS, MARKET_TYPE } from '../../constants';

export const ACCOUNT_ICONS = {
    [MARKET_TYPE.SYNTHETIC]: <AccountsDmt5StandardIcon iconSize='lg' />,
    [MARKET_TYPE.FINANCIAL]: <AccountsDmt5FinancialIcon iconSize='lg' />,
    [MARKET_TYPE.ALL]: <AccountsDmt5SwfIcon iconSize='lg' />,
    [CFD_PLATFORMS.DXTRADE]: <AccountsDerivXIcon iconSize='lg' />,
    [CFD_PLATFORMS.CTRADER]: <PartnersProductDerivCtraderBrandLightLogoHorizontalIcon height={48} width={48} />,
    default: <AccountsDmt5CfdsIcon iconSize='lg' />,
} as const;

export const MARKET_TYPE_SHORTCODE = {
    ALL_DXTRADE: 'all_',
    ALL_SVG: 'all_svg',
    FINANCIAL_BVI: 'financial_bvi',
    FINANCIAL_LABUAN: 'financial_labuan',
    FINANCIAL_MALTAINVEST: 'financial_maltainvest',
    FINANCIAL_SVG: 'financial_svg',
    FINANCIAL_VANUATU: 'financial_vanuatu',
    GAMING: 'gaming',
    SYNTHETIC_BVI: 'synthetic_bvi',
    SYNTHETIC_SVG: 'synthetic_svg',
    SYNTHETIC_VANUATU: 'synthetic_vanuatu',
} as const;

export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const platformLabel = {
    CTrader: 'Deriv cTrader',
    DerivX: 'Deriv X',
    MT5: 'MT5 Platform',
    OtherCFDs: 'Other CFDs Platform',
} as const;

export const headerColor = {
    CTrader: 'orange',
    DerivX: 'green',
    MT5: 'blue',
    OtherCFDs: 'green',
} as const;
