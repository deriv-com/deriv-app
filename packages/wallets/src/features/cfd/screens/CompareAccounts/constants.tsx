import React from 'react';
import {
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5SwfIcon,
    AccountsDmt5ZrsIcon,
    PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
} from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { CFD_PLATFORMS } from '../../constants';

export const MT5_PRODUCT = {
    FINANCIAL: 'financial',
    STANDARD: 'standard',
    STP: 'stp',
    SWAP_FREE: 'swap_free',
    ZERO_SPREAD: 'zero_spread',
} as const;

export const ACCOUNT_ICONS = {
    [MT5_PRODUCT.STANDARD]: <AccountsDmt5StandardIcon iconSize='lg' />,
    [MT5_PRODUCT.FINANCIAL]: { Eu: <AccountsDmt5CfdsIcon />, NonEU: <AccountsDmt5FinancialIcon iconSize='lg' /> },
    [MT5_PRODUCT.SWAP_FREE]: <AccountsDmt5SwfIcon iconSize='lg' />,
    [CFD_PLATFORMS.DXTRADE]: <AccountsDerivXIcon iconSize='lg' />,
    [CFD_PLATFORMS.CTRADER]: <PartnersProductDerivCtraderBrandLightLogoHorizontalIcon height={48} width={48} />,
    [MT5_PRODUCT.ZERO_SPREAD]: <AccountsDmt5ZrsIcon iconSize='lg' />,
    default: <AccountsDmt5CfdsIcon iconSize='lg' />,
} as const;

export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const platformLabel = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    CTrader: 'Deriv cTrader',
    DerivX: 'Deriv X',
    MT5: localize('MT5 Platform'),
    OtherCFDs: localize('Other CFDs Platform'),
});

export const headerColor = {
    CTrader: 'orange',
    DerivX: 'green',
    MT5: 'blue',
    OtherCFDs: 'green',
} as const;
