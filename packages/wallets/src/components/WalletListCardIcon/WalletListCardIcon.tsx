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

const typeToIconMapper = {
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

const typeToSizeMapper = {
    USD: { mobile: 32, desktop: 48, small: 16 },
    EUR: { mobile: 32, desktop: 48, small: 16 },
    GBP: { mobile: 32, desktop: 48, small: 16 },
    BTC: { mobile: 45, desktop: 90, small: 32 },
    USDC: { mobile: 45, desktop: 90, small: 32 },
    ETH: { mobile: 45, desktop: 90, small: 32 },
    LTC: { mobile: 45, desktop: 90, small: 32 },
    UST: { mobile: 45, desktop: 90, small: 32 },
    eUSDT: { mobile: 45, desktop: 90, small: 32 },
    Demo: { mobile: 45, desktop: 90, small: 32 },
};

type TProps = {
    small?: boolean;
    type: Omit<string, keyof typeof typeToIconMapper> | keyof typeof typeToIconMapper;
};

const WalletListCardIcon: React.FC<TProps> = ({ small = false, type }) => {
    const { isMobile } = useDevice();

    let iconType = type as keyof typeof typeToIconMapper;

    if (!Object.keys(typeToSizeMapper).includes(iconType)) iconType = 'USD';

    const Icon = typeToIconMapper[iconType];
    const size = small ? typeToSizeMapper[iconType].small : typeToSizeMapper[iconType][isMobile ? 'mobile' : 'desktop'];

    if (!Icon) return null;

    return <Icon width={size} />;
};

export default WalletListCardIcon;
