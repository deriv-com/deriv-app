import React from 'react';
import { THooks } from '../../types';
import { WalletText } from '../Base';

type TWalletDescriptionMapper = {
    [key: string]: string;
};

type TProps = {
    currency: Exclude<THooks.AllWalletAccounts['currency'], undefined>;
};

const walletDescriptionMapper: TWalletDescriptionMapper = {
    AUD: 'Deposit and withdraw Australian dollars using credit or debit cards, e-wallets, or bank wires.',
    BTC: "Deposit and withdraw Bitcoin, the world's most popular cryptocurrency, hosted on the Bitcoin blockchain.",
    ETH: 'Deposit and withdraw Ether, the fastest growing cryptocurrency, hosted on the Ethereum blockchain.',
    EUR: 'Deposit and withdraw euros into your accounts regulated by MFSA using credit or debit cards and e-wallets.',
    eUSDT: 'Deposit and withdraw Tether ERC20, a version of Tether hosted on the Ethereum blockchain.',
    LTC: 'Deposit and withdraw Litecoin, the cryptocurrency with low transaction fees, hosted on the Litecoin blockchain.',
    PaymentAgent: 'Deposit and withdraw funds via authorised, independent payment agents.',
    tUSDT: 'Deposit and withdraw Tether TRC20, a version of Tether hosted on the TRON blockchain.',
    USD: 'Deposit and withdraw US dollars using credit or debit cards, e-wallets, or bank wires.',
    USDC: 'Deposit and withdraw USD Coin, hosted on the Ethereum blockchain.',
    UST: 'Deposit and withdraw Tether Omni, hosted on the Bitcoin blockchain.',
};

const WalletsAddMoreCardContent: React.FC<TProps> = ({ currency }) => {
    return (
        <div className='wallets-add-more__content'>
            <WalletText size='md' weight='bold'>
                {currency} Wallet
            </WalletText>

            <WalletText size='sm'>{walletDescriptionMapper[currency]}</WalletText>
        </div>
    );
};

export default WalletsAddMoreCardContent;
