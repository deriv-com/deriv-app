/* eslint-disable sort-keys */
import React from 'react';
import useDevice from '../../hooks/useDevice';
import { TGenericSizes } from '../../types';
import {
    PaymentMethodBitcoinBrandLightIcon,
    SubBrandDerivDemoBrandDarkIcon,
    PaymentMethodEthereumBrandDarkIcon,
    CurrencyEurIcon,
    PaymentMethodTetherUsdtBrandDarkIcon,
    CurrencyGbpIcon,
    PaymentMethodLitecoinBrandDarkIcon,
    CurrencyUsdIcon,
    PaymentMethodUsdCoinBrandDarkIcon,
} from '@deriv/quill-icons';

const typeToIconMapper = {
    BTC: PaymentMethodBitcoinBrandLightIcon,
    Demo: SubBrandDerivDemoBrandDarkIcon,
    ETH: PaymentMethodEthereumBrandDarkIcon,
    EUR: CurrencyEurIcon,
    eUSDT: PaymentMethodTetherUsdtBrandDarkIcon,
    GBP: CurrencyGbpIcon,
    LTC: PaymentMethodLitecoinBrandDarkIcon,
    tUSDT: PaymentMethodTetherUsdtBrandDarkIcon,
    USD: CurrencyUsdIcon,
    USDC: PaymentMethodUsdCoinBrandDarkIcon,
    UST: PaymentMethodTetherUsdtBrandDarkIcon,
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
