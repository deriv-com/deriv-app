import React from 'react';
import useDevice from '../../hooks/useDevice';
import Bitcoin from '../../public/images/bitcoin.svg';
import Demo from '../../public/images/demo.svg';
import ETH from '../../public/images/eth.svg';
import EUR from '../../public/images/eur.svg';
import Tether from '../../public/images/eusdt.svg';
import GBP from '../../public/images/gbp.svg';
import LTC from '../../public/images/ltc.svg';
import USD from '../../public/images/usd.svg';
import USDC from '../../public/images/usdc.svg';

const type_to_icon_mapper = {
    USD,
    EUR,
    GBP,
    BTC: Bitcoin,
    USDC,
    ETH,
    LTC,
    UST: Tether,
    eUSDT: Tether,
    Demo,
};

const type_to_size_mapper = {
    USD: { mobile: 32, desktop: 48 },
    EUR: { mobile: 32, desktop: 48 },
    GBP: { mobile: 32, desktop: 48 },
    BTC: { mobile: 45, desktop: 90 },
    USDC: { mobile: 45, desktop: 90 },
    ETH: { mobile: 45, desktop: 90 },
    LTC: { mobile: 45, desktop: 90 },
    UST: { mobile: 45, desktop: 90 },
    eUSDT: { mobile: 45, desktop: 90 },
    Demo: { mobile: 45, desktop: 90 },
};

type TProps = {
    type: keyof typeof type_to_icon_mapper | Omit<string, keyof typeof type_to_icon_mapper>;
};

const WalletListCardIcon: React.FC<TProps> = ({ type }) => {
    const { is_mobile } = useDevice();

    let icon_type = type as keyof typeof type_to_icon_mapper;

    if (!Object.keys(type_to_size_mapper).includes(icon_type)) icon_type = 'USD';

    const Icon = type_to_icon_mapper[icon_type];
    const size = type_to_size_mapper[icon_type][is_mobile ? 'mobile' : 'desktop'];

    if (!Icon) return null;

    return <Icon width={size} />;
};

export default WalletListCardIcon;
