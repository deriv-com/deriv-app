/* eslint-disable sort-keys */
import React from 'react';
import useDevice from '../../hooks/useDevice';
import AUD from '../../public/images/aud.svg';
import BTC from '../../public/images/bitcoin.svg';
import BTCCircularIcon from '../../public/images/btc-logo.svg';
import Demo from '../../public/images/demo.svg';
import DemoCircularIcon from '../../public/images/demo-logo.svg';
import ETH from '../../public/images/eth.svg';
import ETHCircularIcon from '../../public/images/eth-logo.svg';
import EUR from '../../public/images/eur.svg';
import Tether from '../../public/images/eusdt.svg';
import TetherCircularIcon from '../../public/images/eusdt-logo.svg';
import GBP from '../../public/images/gbp.svg';
import LTC from '../../public/images/ltc.svg';
import LTCCircularIcon from '../../public/images/ltc-logo.svg';
import USD from '../../public/images/usd.svg';
import USDC from '../../public/images/usdc.svg';
import USDCCircularIcon from '../../public/images/usdc-logo.svg';
import { TGenericSizes } from '../../types';

const typeToIconMapper = {
    AUD,
    BTC,
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

const typeToCircularIconMapper = {
    ...typeToIconMapper,
    BTC: BTCCircularIcon,
    Demo: DemoCircularIcon,
    ETH: ETHCircularIcon,
    eUSDT: TetherCircularIcon,
    LTC: LTCCircularIcon,
    tUSDT: TetherCircularIcon,
    USDC: USDCCircularIcon,
    UST: TetherCircularIcon,
};

const typeToWidthMapper = {
    rectangleIcon: {
        sm: { desktop: 60, mobile: 60 },
        md: { desktop: 72, mobile: 36 },
        lg: { desktop: 90, mobile: 45 },
        xl: { desktop: 120, mobile: 80 },
    },
    roundedIcon: {
        sm: { desktop: 16, mobile: 16 },
        md: { desktop: 32, mobile: 24 },
        lg: { desktop: 48, mobile: 32 },
        xl: { desktop: 64, mobile: 48 },
    },
    circularIcon: {
        //Todo: update size of icons for mobile/responsive
        sm: { desktop: 16, mobile: 16 },
        md: { desktop: 32, mobile: 32 },
        lg: { desktop: 64, mobile: 64 },
        xl: { desktop: 128, mobile: 128 },
    },
};

const typesWithRoundedIcon = ['AUD', 'EUR', 'GBP', 'USD'];

type TProps = {
    device?: 'desktop' | 'mobile';
    size?: Extract<TGenericSizes, 'lg' | 'md' | 'sm' | 'xl'>;
    type: Omit<string, keyof typeof typeToIconMapper> | keyof typeof typeToIconMapper;
    variant?: 'circular' | 'normal';
};

const WalletCardIcon: React.FC<TProps> = ({ device, size = 'lg', type, variant = 'normal' }) => {
    const { isMobile } = useDevice();

    const iconType = type as keyof typeof typeToIconMapper;
    const circularIconType = type as keyof typeof typeToCircularIconMapper;

    const Icon = variant === 'circular' ? typeToCircularIconMapper[circularIconType] : typeToIconMapper[iconType];
    const isRoundedIcon = typesWithRoundedIcon.includes(iconType);

    let iconGroup: 'circularIcon' | 'rectangleIcon' | 'roundedIcon' = 'rectangleIcon';
    if (variant === 'circular') {
        iconGroup = 'circularIcon';
    } else if (isRoundedIcon) {
        iconGroup = 'roundedIcon';
    }

    const width = typeToWidthMapper[iconGroup][size][device || (isMobile ? 'mobile' : 'desktop')];

    if (!Icon) return null;

    return <Icon data-testid='dt_wallet_card_icon' width={width} />;
};

export default WalletCardIcon;
