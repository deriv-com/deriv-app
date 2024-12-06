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
import AccountsDmt5GoldIcon from '../../../../public/images/account-dmt5-gold-icon.svg';
import { CFD_PLATFORMS } from '../../constants';

export const MT5_PRODUCT = {
    FINANCIAL: 'financial',
    GOLD: 'gold',
    STANDARD: 'standard',
    STP: 'stp',
    SWAP_FREE: 'swap_free',
    ZERO_SPREAD: 'zero_spread',
} as const;

type TProps = React.ComponentProps<typeof AccountsDmt5GoldIcon> | React.ComponentProps<typeof AccountsDmt5StandardIcon>;

export const ACCOUNT_ICONS = {
    [MT5_PRODUCT.STANDARD]: (props: TProps) => <AccountsDmt5StandardIcon {...props} />,
    [MT5_PRODUCT.FINANCIAL]: {
        Eu: (props: TProps) => <AccountsDmt5CfdsIcon {...props} />,
        NonEU: (props: TProps) => <AccountsDmt5FinancialIcon {...props} />,
    },
    [MT5_PRODUCT.SWAP_FREE]: (props: TProps) => <AccountsDmt5SwfIcon {...props} />,
    [CFD_PLATFORMS.DXTRADE]: (props: TProps) => <AccountsDerivXIcon {...props} />,
    [CFD_PLATFORMS.CTRADER]: (props: TProps) => <PartnersProductDerivCtraderBrandLightLogoHorizontalIcon {...props} />,
    [MT5_PRODUCT.ZERO_SPREAD]: (props: TProps) => <AccountsDmt5ZrsIcon {...props} />,
    [MT5_PRODUCT.GOLD]: (props: TProps) => <AccountsDmt5GoldIcon {...props} />,
    default: (props: TProps) => <AccountsDmt5CfdsIcon {...props} />,
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
