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
import { TGenericSizes } from '../../types';

const typeToIconMapper = {
    BTC: Bitcoin,
    Demo,
    ETH,
    EUR,
    eUSDT: Tether,
    GBP,
    LTC,
    tUSDT: Tether,
    USD,
    USDC,
    UST: Tether,
};

const typeToWidthMapper = {
    rectangleIcon: {
        lg: { desktop: 90, mobile: 45 },
        md: { desktop: 72, mobile: 36 },
        sm: { desktop: 60, mobile: 60 },
        xl: { desktop: 120, mobile: 80 },
    },
    roundedIcon: {
        lg: { desktop: 48, mobile: 32 },
        md: { desktop: 32, mobile: 24 },
        sm: { desktop: 16, mobile: 16 },
        xl: { desktop: 64, mobile: 48 },
    },
};

const typesWithRoundedIcon = ['EUR', 'GBP', 'USD'];

type TProps = {
    device?: 'desktop' | 'mobile';
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm' | 'xl'>;
    type: Omit<string, keyof typeof typeToIconMapper> | keyof typeof typeToIconMapper;
};

const WalletCardIcon: React.FC<TProps> = ({ device, size = 'lg', type }) => {
    const { isMobile } = useDevice();

    let iconType = type as keyof typeof typeToIconMapper;

    if (!Object.keys(typeToIconMapper).includes(iconType)) iconType = 'USD';

    const Icon = typeToIconMapper[iconType];
    const isRoundedIcon = typesWithRoundedIcon.includes(iconType);
    const width =
        typeToWidthMapper[isRoundedIcon ? 'roundedIcon' : 'rectangleIcon'][size][
            device || (isMobile ? 'mobile' : 'desktop')
        ];

    if (!Icon) return null;

    return <Icon width={width} />;
};

export default WalletCardIcon;
