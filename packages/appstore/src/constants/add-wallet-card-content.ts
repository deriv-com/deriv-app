import { localize } from '@deriv/translations';

const add_wallet_content = [
    {
        currency: 'AUD',
        title: 'AUD Wallet',
        description: localize(
            'Deposit and withdraw Australian dollars using credit or debit cards, e-wallets, or bank wires.'
        ),
    },
    {
        currency: 'EUR',
        title: 'EUR Wallet',
        description: localize(
            'Deposit and withdraw euros into your accounts regulated by MFSA using credit or debit cards and e-wallets.'
        ),
    },
    {
        currency: 'USD',
        title: 'USD Wallet',
        description: localize(
            'Deposit and withdraw US dollars into your accounts regulated by MFSA using credit or debit cards and e-wallets.'
        ),
    },
    {
        currency: 'BTC',
        title: 'BTC Wallet',
        description: localize(
            "Deposit and withdraw Bitcoin, the world's most popular cryptocurrency, hosted on the Bitcoin blockchain."
        ),
    },
    {
        currency: 'ETH',
        title: 'ETH Wallet',
        description: localize(
            'Deposit and withdraw Ether, the fastest growing cryptocurrency, hosted on the Ethereum blockchain.'
        ),
    },
    {
        currency: 'LTC',
        title: 'LTC Wallet',
        description: localize(
            'Deposit and withdraw Litecoin, the cryptocurrency with low transaction fees, hosted on the Litecoin blockchain.'
        ),
    },
    {
        currency: 'USDC',
        title: 'USDC Wallet',
        description: localize('Deposit and withdraw USD Coin, hosted on the Ethereum blockchain.'),
    },
    {
        currency: 'eUSDT',
        title: 'eUSDT Wallet',
        description: localize(
            'Deposit and withdraw Tether ERC20, a version of Tether hosted on the Ethereum blockchain.'
        ),
    },
    {
        currency: 'tUSDT',
        title: 'tUSDT Wallet',
        description: localize('Deposit and withdraw Tether TRC20, a version of Tether hosted on the TRON blockchain.'),
    },
    {
        currency: 'UST',
        title: 'USDT Wallet',
        description: localize('Deposit and withdraw Tether Omni, hosted on the Bitcoin blockchain.'),
    },
    {
        currency: 'PaymentAgent',
        title: 'Payment Agent Wallet',
        description: localize('Deposit and withdraw funds via authorised, independent payment agents.'),
    },
];

export const getAddWalletDetails = (currency: string) => {
    const wallet = add_wallet_content.find(item => item.currency === currency);
    return wallet ? { title: wallet.title, description: wallet.description } : { title: '', description: '' };
};
