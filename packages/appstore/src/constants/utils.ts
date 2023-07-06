import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

/**
 * This function checks whether the current item should have a border at the bottom 'aka "divider" '.
 * @function getHasDivider
 * @param { number } current_item_index // the index of the current list item
 * @param { number } list_size // size of the whole list
 * @param { number } available_grid_columns // how many css grid columns the container element has or provides
 * @return { boolean }
 * */
export const getHasDivider = (current_item_index: number, list_size: number, available_grid_columns: number) => {
    if (list_size < available_grid_columns) {
        return false;
    } else if (isMobile()) {
        return current_item_index < list_size - 1;
    }
    return (
        current_item_index <
        list_size -
            (list_size % available_grid_columns === 0 ? available_grid_columns : list_size % available_grid_columns)
    );
};

export const getWalletHeaderButtons = (is_demo: boolean, handleAction?: () => void) => {
    return is_demo
        ? [
              {
                  name: 'Transfer',
                  text: localize('Transfer'),
                  icon: 'IcAccountTransfer',
                  action: () => handleAction?.(),
              },
              {
                  name: 'Transactions',
                  text: localize('Transactions'),
                  icon: 'IcStatement',
                  action: () => handleAction?.(),
              },
              {
                  name: 'Deposit',
                  text: localize('Reset balance'),
                  icon: 'IcCashierAdd',
                  action: () => handleAction?.(),
              },
          ]
        : [
              {
                  name: 'Deposit',
                  text: localize('Deposit'),
                  icon: 'IcCashierAdd',
                  action: () => handleAction?.(),
              },
              {
                  name: 'Withdraw',
                  text: localize('Withdraw'),
                  icon: 'IcCashierMinus',
                  action: () => handleAction?.(),
              },
              {
                  name: 'Transfer',
                  text: localize('Transfer'),
                  icon: 'IcAccountTransfer',
                  action: () => handleAction?.(),
              },
              {
                  name: 'Transactions',
                  text: localize('Transactions'),
                  icon: 'IcStatement',
                  action: () => handleAction?.(),
              },
          ];
};

type TTransferAccount = {
    account_type?: 'wallet' | 'trading' | 'dxtrade' | 'mt5' | 'derivez' | 'binary' | 'ctrader';
    balance: number;
    currency: string;
    display_currency_code?: string;
    gradient_class: string;
    is_demo: boolean;
    loginid: string;
    mt5_market_type?: 'all' | 'financial' | 'synthetic';
    shortcode?: string;
    type: 'fiat' | 'crypto';
    wallet_icon?: string;
};

export const getAccountName = (account?: TTransferAccount): string => {
    switch (account?.account_type) {
        case 'trading':
            return localize('Deriv Apps');
        case 'mt5': {
            switch (account.mt5_market_type) {
                case 'financial':
                    return localize('MT5 Financial');
                case 'synthetic':
                    return localize('MT5 Derived');
                case 'all':
                    return localize('MT5 Swap-free');
                default:
                    return '';
            }
        }
        case 'derivez':
            return localize('Deriv EZ');
        case 'dxtrade':
            return localize('Deriv X');
        case 'ctrader':
            return localize('Deriv cTrader');
        case 'wallet':
            return localize('{{display_currency_code}} Wallet', {
                display_currency_code: account.display_currency_code?.toUpperCase(),
            });
        default:
            return '';
    }
};
