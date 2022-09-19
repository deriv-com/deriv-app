type TWalletTypes = {
    [key: string]: {
        color: string;
        icon: string;
    };
};
export const wallets: TWalletTypes = {
    Bitcoin: { color: '#F7931B', icon: 'Bitcoin' },
    'Credit cards': { color: '#3C58C6', icon: 'CreditCards' },
    Demo: { color: '#1A8FFF', icon: 'Demo' },
    'Deriv P2P': { color: '#FF444F', icon: 'DerivP2p' },
    Ethereum: { color: '#52567F', icon: 'Ethereum' },
    Litecoin: { color: '#A5A8A9', icon: 'Litecoin' },
    'Payment agent': { color: '#979797', icon: 'PaymentAgent' },
    Tether: { color: '#009393', icon: 'Tether' },
    'USD Coin': { color: '#2775CA', icon: 'UsdCoin' },
};
