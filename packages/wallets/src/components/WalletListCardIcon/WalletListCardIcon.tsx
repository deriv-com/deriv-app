import React from 'react';
import Bitcion from '../../public/images/bitcion.svg';
import Demo from '../../public/images/demo.svg';
import ETH from '../../public/images/eth.svg';
import EUR from '../../public/images/eur.svg';
import Tether from '../../public/images/eusdt.svg';
import GBP from '../../public/images/gbp.svg';
import LTC from '../../public/images/ltc.svg';
import USD from '../../public/images/usd.svg';
import USDC from '../../public/images/usdc.svg';
import './WalletListCardIcon.scss';

const type_to_icon_mapper = {
    USD,
    EUR,
    BTC: Bitcion,
    GBP,
    USDC,
    ETH,
    LTC,
    UST: Tether,
    eUSDT: Tether,
    Demo,
};

const WalletListCardIcon: React.FC<{
    type: keyof typeof type_to_icon_mapper | Omit<string, keyof typeof type_to_icon_mapper>;
}> = ({ type }) => {
    // @ts-expect-error The `type` will always exist in the `type_to_icon_mapper` object, Hence can ignore the TS error.
    const Icon = type_to_icon_mapper[type];

    if (!Icon) return null;

    return <Icon className='wallets-card__icon' />;
};

export default WalletListCardIcon;
