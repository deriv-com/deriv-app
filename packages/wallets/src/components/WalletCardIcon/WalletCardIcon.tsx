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
import './WalletCardIcon.scss';

const typeToIconMapper = {
    BTC: Bitcoin,
    Demo,
    ETH,
    EUR,
    eUSDT: Tether,
    GBP,
    LTC,
    USD,
    USDC,
    UST: Tether,
};

const typeToWidthMapper = {
    rectangleIcon: { desktop: 90, mobile: 45 },
    roundedIcon: { desktop: 48, mobile: 32 },
};

const typesWithRoundedIcon = ['EUR', 'GBP', 'USD'];

type TProps = {
    size?: 'lg' | 'md' | 'sm' | 'xs';
    type: Omit<string, keyof typeof typeToIconMapper> | keyof typeof typeToIconMapper;
};

const WalletCardIcon: React.FC<TProps> = ({ size = 'md', type }) => {
    const { isMobile } = useDevice();

    let iconType = type as keyof typeof typeToIconMapper;

    if (!Object.keys(typeToIconMapper).includes(iconType)) iconType = 'USD';

    const Icon = typeToIconMapper[iconType];
    const isRoundedIcon = typesWithRoundedIcon.includes(iconType);
    const defaultWidth =
        typeToWidthMapper[isRoundedIcon ? 'roundedIcon' : 'rectangleIcon'][isMobile ? 'mobile' : 'desktop'];

    if (!Icon) return null;

    return (
        <Icon
            className={`wallets-card-icon-${size} ${isRoundedIcon ? `wallets-card-icon-${size}--rounded` : ''}`}
            width={defaultWidth}
        />
    );
};

export default WalletCardIcon;
