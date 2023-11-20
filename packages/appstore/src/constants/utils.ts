import { isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';

import { TTransferAccount, TWalletButton } from 'Types';

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

// TODO: Moved to shared package! Delete it later, right now it uses for cashier wallet modals
// TODO: Refactor using data transformation layer pattern when we will have API for wallets (e.g. wallet.icon)
export const getWalletCurrencyIcon = (currency: string, is_dark_mode_on: boolean, is_modal = false) => {
    switch (currency) {
        case 'demo':
            if (is_modal) return 'IcWalletDerivDemoLight';
            return is_dark_mode_on ? 'IcWalletDerivDemoDark' : 'IcWalletDerivDemoLight';
        case 'USD':
            return 'IcWalletCurrencyUsd';
        case 'EUR':
            return 'IcWalletCurrencyEur';
        case 'AUD':
            return 'IcWalletCurrencyAud';
        case 'GBP':
            return 'IcWalletCurrencyGbp';
        case 'BTC':
            return is_dark_mode_on ? 'IcWalletBitcoinDark' : 'IcWalletBitcoinLight';
        case 'ETH':
            return is_dark_mode_on ? 'IcWalletEtheriumDark' : 'IcWalletEtheriumLight';
        case 'USDT':
        case 'eUSDT':
        case 'tUSDT':
        case 'UST':
            if (is_modal) {
                return is_dark_mode_on ? 'IcWalletModalTetherDark' : 'IcWalletModalTetherLight';
            }
            return is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight';
        case 'LTC':
            return is_dark_mode_on ? 'IcWalletLiteCoinDark' : 'IcWalletLiteCoinLight';
        case 'USDC':
            return is_dark_mode_on ? 'IcWalletUsdCoinDark' : 'IcWalletUsdCoinLight';
        default:
            return 'Unknown';
    }
};

export const getWalletHeaderButtons = (is_demo: boolean, handleAction?: () => void): TWalletButton[] => {
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

export const getAccountName = ({
    account_type,
    mt5_market_type,
    display_currency_code,
}: Partial<Pick<TTransferAccount, 'account_type' | 'display_currency_code' | 'mt5_market_type'>>): string => {
    switch (account_type) {
        case 'trading':
            return localize('Deriv Apps');
        case 'mt5': {
            switch (mt5_market_type) {
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
        case 'dxtrade':
            return localize('Deriv X');
        // @ts-expect-error Need to update @deriv/api-types to fix the TS error
        case 'ctrader':
            return localize('Deriv cTrader');
        case 'wallet':
            return localize('{{display_currency_code}} Wallet', {
                display_currency_code,
            });
        default:
            return '';
    }
};
