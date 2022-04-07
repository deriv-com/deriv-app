import { localize } from '@deriv/translations';

type TWalletDescription = {
    [key: string]: {
        title: string;
        description: string;
        deposit_information: string;
        withdrawal_information: string;
    };
};

const wallet_descriptions: TWalletDescription = {
    aud: {
        title: localize('AUD wallet'),
        description: localize(
            'Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'
        ),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    bitcoin: {
        title: localize('BTC wallet'),
        description: localize('Deposit and withdraw in Bitcoin, the world\'s first cryptocurrency.'),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    deriv_p2p: {
        title: localize('Deriv P2P USD wallet'),
        description: localize('Deposit and withdraw in Bitcoin, the world\'s first cryptocurrency.'),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    ethereum: {
        title: localize('ETH wallet'),
        description: localize(
            'Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'
        ),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    eur: {
        title: localize('EUR wallet'),
        description: localize(
            'Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'
        ),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    gbp: {
        title: localize('GBP wallet'),
        description: localize(
            'Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'
        ),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    litecoin: {
        title: localize('LTC wallet'),
        description: localize('Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    payment_agent: {
        title: localize('Payment agent wallet'),
        description: localize(
            'Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide'
        ),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    tether: {
        title: localize('Tether wallet'),
        description: localize(
            'Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'
        ),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    usd: {
        title: localize('USD wallet'),
        description: localize(
            'Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'
        ),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
    usd_coin: {
        title: localize('USD coin'),
        description: localize('Quick, simple to use, and available anywhere, anytime. Used by millions of clients worldwide.'),
        deposit_information: localize('Deposits are instant'),
        withdrawal_information: localize('Withdrawals take 1 hour to 2 days'),
    },
};

export default wallet_descriptions;
