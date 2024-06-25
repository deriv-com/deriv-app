import {
    AccountsDerivAccountLightIcon,
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5DerivedIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5SwfIcon,
    DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    PartnersProductSmarttraderBrandLightLogoIcon,
} from '@deriv/quill-icons';
import { TIconTypes } from '../types';

export const AppIcons: TIconTypes = {
    binarybot: PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    bot: DerivProductDerivBotBrandLightLogoHorizontalIcon,
    derivgo: DerivProductDerivGoBrandLightLogoHorizontalIcon,
    smarttrader: PartnersProductSmarttraderBrandLightLogoIcon,
    trader: DerivProductDerivTraderBrandLightLogoHorizontalIcon,
};

export const CFDPlatformIcons: TIconTypes = {
    ctrader: AccountsDerivCtraderIcon,
    dxtrade: AccountsDerivXIcon,
};

export const MT5MarketIcons: TIconTypes = {
    all: AccountsDmt5SwfIcon,
    cfds: AccountsDmt5CfdsIcon,
    financial: AccountsDmt5FinancialIcon,
    synthetic: AccountsDmt5DerivedIcon,
};

export const PlatformIcons: TIconTypes = {
    standard: AccountsDerivAccountLightIcon,
};
