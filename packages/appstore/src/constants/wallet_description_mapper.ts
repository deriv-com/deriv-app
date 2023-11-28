import { localize } from '@deriv/translations';

type TWalletDescriptionMapper = {
    [key: string]: string;
};

const wallet_description_mapper: TWalletDescriptionMapper = {
    AUD: localize('Deposit and withdraw Australian dollars using credit or debit cards, e-wallets, or bank wires.'),
    EUR: localize(
        'Deposit and withdraw euros into your accounts regulated by MFSA using credit or debit cards and e-wallets.'
    ),
    USD: localize('Deposit and withdraw US dollars using credit or debit cards, e-wallets, or bank wires.'),
    BTC: localize(
        "Deposit and withdraw Bitcoin, the world's most popular cryptocurrency, hosted on the Bitcoin blockchain."
    ),
    ETH: localize('Deposit and withdraw Ether, the fastest growing cryptocurrency, hosted on the Ethereum blockchain.'),
    LTC: localize(
        'Deposit and withdraw Litecoin, the cryptocurrency with low transaction fees, hosted on the Litecoin blockchain.'
    ),
    USDC: localize('Deposit and withdraw USD Coin, hosted on the Ethereum blockchain.'),
    eUSDT: localize('Deposit and withdraw Tether ERC20, a version of Tether hosted on the Ethereum blockchain.'),
    tUSDT: localize('Deposit and withdraw Tether TRC20, a version of Tether hosted on the TRON blockchain.'),
    UST: localize('Deposit and withdraw Tether Omni, hosted on the Bitcoin blockchain.'),
    PaymentAgent: localize('Deposit and withdraw funds via authorised, independent payment agents.'),
};

export default wallet_description_mapper;
