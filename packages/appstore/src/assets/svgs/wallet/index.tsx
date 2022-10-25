import React from 'react';
import BinaryBot from 'Assets/svgs/wallet/ic-brand-binarybot.svg';
import BinaryBotBlue from 'Assets/svgs/wallet/ic-appstore-binarybot-blue.svg';
import CurrencyUSD from 'Assets/svgs/wallet/currency-usd.svg';
import DBot from 'Assets/svgs/wallet/ic-brand-dbot.svg';
import Demo from 'Assets/svgs/wallet/ic-brand-demo.svg';
import Derived from 'Assets/svgs/wallet/ic-appstore-derived.svg';
import DerivGo from 'Assets/svgs/wallet/ic-brand-derivgo.svg';
import DerivGoBlack from 'Assets/svgs/wallet/ic-appstore-derivgo-black.svg';
import DerivLogo from 'Assets/svgs/wallet/ic-appstore-deriv-logo.svg';
import DerivX from 'Assets/svgs/wallet/ic-appstore-derivx.svg';
import DropDown from 'Assets/svgs/wallet/drop-down.svg';
import DTrader from 'Assets/svgs/wallet/ic-brand-dtrader.svg';
import FasapayLight from 'Assets/svgs/wallet/fasapay-light.svg';
import Financial from 'Assets/svgs/wallet/ic-appstore-financial.svg';
import Options from 'Assets/svgs/wallet/ic-appstore-options.svg';
import PaymentAgentLight from 'Assets/svgs/wallet/payment-agent-light.svg';
import SkrillLight from 'Assets/svgs/wallet/skrill-light.svg';
import SmartTrader from 'Assets/svgs/wallet/ic-brand-smarttrader.svg';
import SmartTraderBlue from 'Assets/svgs/wallet/ic-appstore-smarttrader-blue.svg';
import UsdLight from 'Assets/svgs/wallet/usd-light.svg';
import ZingpayLight from 'Assets/svgs/wallet/zingpay-light.svg';

const Icons = {
    BinaryBot,
    BinaryBotBlue,
    CurrencyUSD,
    DBot,
    Demo,
    Derived,
    DerivGo,
    DerivGoBlack,
    DerivLogo,
    DerivX,
    DropDown,
    DTrader,
    FasapayLight,
    Financial,
    Options,
    PaymentAgentLight,
    SkrillLight,
    SmartTrader,
    SmartTraderBlue,
    UsdLight,
    ZingpayLight,
};

const WalletIcon = ({
    icon,
    className,
    size,
    onClick,
}: {
    icon: string;
    className?: string;
    size?: number;
    onClick?: () => void;
}) => {
    const Icon = Icons[icon as keyof typeof Icons] as React.ElementType;

    return Icon ? <Icon className={className} style={{ width: size, height: size }} onClick={onClick} /> : null;
};

export default WalletIcon;
