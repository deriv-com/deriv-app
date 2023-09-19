import React from 'react';
import useDevice from '../../hooks/useDevice';
import AUD from '../../public/images/currencies/aud.svg';
import BTC from '../../public/images/currencies/btc.svg';
import Demo from '../../public/images/currencies/demo.svg';
import ETH from '../../public/images/currencies/eth.svg';
import EUR from '../../public/images/currencies/eur.svg';
import Tether from '../../public/images/currencies/eusdt.svg';
import GBP from '../../public/images/currencies/gbp.svg';
import LTC from '../../public/images/currencies/ltc.svg';
import USD from '../../public/images/currencies/usd.svg';
import USDC from '../../public/images/currencies/usdc.svg';

const type_to_icon_mapper = {
    AUD,
    USD,
    EUR,
    GBP,
    BTC,
    USDC,
    ETH,
    LTC,
    UST: Tether,
    eUSDT: Tether,
    tUSDT: Tether,
    Demo,
};

const crypto_icons = ['BTC', 'USDC', 'ETH', 'LTC', 'UST', 'eUSDT', 'tUSDT', 'Demo'];
const currency_icons = ['AUD', 'USD', 'EUR', 'GBP'];

type TIconSize = {
    mobile: number;
    desktop: number;
};

type TProps = {
    type: keyof typeof type_to_icon_mapper | Omit<string, keyof typeof type_to_icon_mapper>;
    crypto_size?: TIconSize;
    currency_size?: TIconSize;
};

const WalletListCardIcon: React.FC<TProps> = ({ type, crypto_size, currency_size }) => {
    const { is_mobile } = useDevice();

    const getSize = React.useCallback(() => {
        const is_crypto = crypto_icons.includes(type as string);
        const is_currency = currency_icons.includes(type as string);

        if (is_crypto) {
            return (
                crypto_size || {
                    mobile: 45,
                    desktop: 90,
                }
            );
        }
        if (is_currency) {
            return (
                currency_size || {
                    mobile: 32,
                    desktop: 48,
                }
            );
        }

        return {
            mobile: 32,
            desktop: 48,
        };
    }, [type]);

    const Icon = React.useMemo(() => type_to_icon_mapper[type as keyof typeof type_to_icon_mapper], [type]);
    const size = getSize()[is_mobile ? 'mobile' : 'desktop'];

    if (!Icon) return null;

    return <Icon width={size} />;
};

export default WalletListCardIcon;
