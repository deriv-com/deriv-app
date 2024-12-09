import {
    AccountsDerivAccountLightIcon,
    AccountsDerivCtraderIcon,
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5SwfIcon,
    AccountsDmt5ZrsIcon,
    CurrencyAudIcon,
    CurrencyBtcIcon,
    CurrencyEthIcon,
    CurrencyEurIcon,
    CurrencyGbpIcon,
    CurrencyLtcIcon,
    CurrencyUsdcIcon,
    CurrencyUsdIcon,
    CurrencyUsdtIcon,
    CurrencyXrpIcon,
    DerivProductBrandLightDerivBotLogoIcon,
    DerivProductBrandLightDerivGoLogoIcon,
    DerivProductBrandLightDerivTraderLogoIcon,
    PartnersProductBrandLightSmarttraderLogoIcon,
    PaymentMethodBitcoinBrandIcon,
    PaymentMethodDerivDemoBrandDarkIcon,
    PaymentMethodEthereumBrandIcon,
    PaymentMethodLitecoinBrandIcon,
    PaymentMethodTetherUsdtBrandIcon,
    PaymentMethodUsdCoinBrandIcon,
    PaymentMethodXrpBrandIcon,
} from '@deriv/quill-icons';
import AccountsDmt5GoldIcon from '../public/images/account-dmt5-gold-icon.svg';
import { TCurrencyIconTypes, TIconTypes } from '../types';

export const AppIcons: TIconTypes = {
    bot: DerivProductBrandLightDerivBotLogoIcon,
    derivgo: DerivProductBrandLightDerivGoLogoIcon,
    smarttrader: PartnersProductBrandLightSmarttraderLogoIcon,
    trader: DerivProductBrandLightDerivTraderLogoIcon,
};

export const CFDPlatformIcons: TIconTypes = {
    all_swap_free: AccountsDmt5SwfIcon,
    all_zero_spread: AccountsDmt5ZrsIcon,
    ctrader: AccountsDerivCtraderIcon,
    dxtrade: AccountsDerivXIcon,
};

export const MT5MarketIcons: TIconTypes = {
    all: AccountsDmt5SwfIcon,
    cfds: AccountsDmt5CfdsIcon,
    financial: AccountsDmt5FinancialIcon,
    synthetic: AccountsDmt5StandardIcon,
};

export const PlatformIcons: TIconTypes = {
    standard: AccountsDerivAccountLightIcon,
};

export const MT5GoldIcon = {
    //TODO: replace with icon from quill-icons and change the extension of the file from tsx to ts
    gold: AccountsDmt5GoldIcon,
};

// Currencies icons
export const fiatIcons = ['AUD', 'EUR', 'GBP', 'USD'] as const;

export const roundedCurrencyIcons: TCurrencyIconTypes = {
    AUD: CurrencyAudIcon,
    BTC: CurrencyBtcIcon,
    ETH: CurrencyEthIcon,
    EUR: CurrencyEurIcon,
    eUSDT: CurrencyUsdtIcon,
    GBP: CurrencyGbpIcon,
    LTC: CurrencyLtcIcon,
    tUSDT: CurrencyUsdtIcon,
    USD: CurrencyUsdIcon,
    USDC: CurrencyUsdcIcon,
    USDT: CurrencyUsdtIcon,
    UST: CurrencyUsdtIcon,
    XRP: CurrencyXrpIcon,
};

export const horizontalCurrencyIcons: TCurrencyIconTypes = {
    BTC: PaymentMethodBitcoinBrandIcon,
    DEMO: PaymentMethodDerivDemoBrandDarkIcon,
    ETH: PaymentMethodEthereumBrandIcon,
    eUSDT: PaymentMethodTetherUsdtBrandIcon,
    LTC: PaymentMethodLitecoinBrandIcon,
    tUSDT: PaymentMethodTetherUsdtBrandIcon,
    USDC: PaymentMethodUsdCoinBrandIcon,
    USDT: PaymentMethodTetherUsdtBrandIcon,
    UST: PaymentMethodTetherUsdtBrandIcon,
    XRP: PaymentMethodXrpBrandIcon,
};
