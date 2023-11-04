export const getAccountName = ({ accountCategory, accountType, displayCurrencyCode, mt5MarketType }: any) => {
    switch (accountCategory) {
        case 'wallet':
            return `${displayCurrencyCode} Wallet`;
        case 'trading': {
            switch (accountType) {
                case 'standard':
                    return 'Deriv Apps';
                case 'dxtrade':
                    return 'Deriv X';
                case 'ctrader':
                    return 'Deriv cTrader';
                case 'derivez':
                    return 'Deriv EZ';
                case 'mt5': {
                    switch (mt5MarketType) {
                        case 'financial':
                            return 'MT5 Financial';
                        case 'synthetic':
                            return 'MT5 Derived';
                        case 'all':
                            return 'MT5 Swap-free';
                        default:
                            return '';
                    }
                }
                default:
                    return '';
            }
        }
        default:
            return '';
    }
};
