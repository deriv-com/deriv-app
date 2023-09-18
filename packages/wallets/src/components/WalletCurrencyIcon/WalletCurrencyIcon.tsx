import React from 'react';
import AUDIcon from '../../public/images/currencies/aud.svg';
import BTCIcon from '../../public/images/currencies/btc.svg';
import ETHIcon from '../../public/images/currencies/eth.svg';
import EURIcon from '../../public/images/currencies/eur.svg';
import TetherIcon from '../../public/images/currencies/eusdt.svg';
import GBPIcon from '../../public/images/currencies/gbp.svg';
import LTCIcon from '../../public/images/currencies/ltc.svg';
import USDIcon from '../../public/images/currencies/usd.svg';
import USDCIcon from '../../public/images/currencies/usdc.svg';

const currencies = {
    aud: AUDIcon,
    btc: BTCIcon,
    eth: ETHIcon,
    eur: EURIcon,
    eusdt: TetherIcon,
    ltc: LTCIcon,
    usd: USDIcon,
    gbp: GBPIcon,
    usdc: USDCIcon,
    tusdt: TetherIcon,
    ust: TetherIcon,
};

type TWalletCurrencyIconProps = {
    currency: string;
};

const WalletCurrencyIcon = ({ currency }: TWalletCurrencyIconProps) => {
    const CurrencyIcon = React.useMemo(() => currencies[currency as keyof typeof currencies], [currency]);

    if (CurrencyIcon) {
        return (
            <div className='wallets-currency-icon'>
                <CurrencyIcon />
            </div>
        );
    }

    return <span>LOGO</span>;
};

export default WalletCurrencyIcon;
