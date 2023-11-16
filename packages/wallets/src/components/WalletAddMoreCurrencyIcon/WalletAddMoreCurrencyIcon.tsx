import React, { useMemo } from 'react';
import AUDIcon from '../../public/images/currencies/aud.svg';
import BTCIcon from '../../public/images/currencies/btc.svg';
import ETHIcon from '../../public/images/currencies/eth.svg';
import EURIcon from '../../public/images/currencies/eur.svg';
import TetherIcon from '../../public/images/currencies/eusdt.svg';
import GBPIcon from '../../public/images/currencies/gbp.svg';
import LTCIcon from '../../public/images/currencies/ltc.svg';
import USDIcon from '../../public/images/currencies/usd.svg';
import USDCIcon from '../../public/images/currencies/usdc.svg';
import { THooks } from '../../types';

const currencies = {
    aud: AUDIcon,
    btc: BTCIcon,
    eth: ETHIcon,
    eur: EURIcon,
    eusdt: TetherIcon,
    gbp: GBPIcon,
    ltc: LTCIcon,
    tusdt: TetherIcon,
    usd: USDIcon,
    usdc: USDCIcon,
    ust: TetherIcon,
};

type TWalletCurrencyIconProps = {
    currency: THooks.AllWalletAccounts['currency'];
};

const WalletAddMoreCurrencyIcon: React.FC<TWalletCurrencyIconProps> = ({ currency }) => {
    const CurrencyIcon = useMemo(() => currencies[currency as keyof typeof currencies], [currency]);

    if (CurrencyIcon) {
        return (
            <div className='wallets-add-more-currency-icon'>
                <CurrencyIcon />
            </div>
        );
    }

    return <span>LOGO</span>;
};

export default WalletAddMoreCurrencyIcon;
