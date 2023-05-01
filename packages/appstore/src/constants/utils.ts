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

export const getWalletCurrencyIcon = (currency: string, is_dark_mode_on: boolean) => {
    switch (currency) {
        case 'demo':
            return is_dark_mode_on ? 'IcWalletDerivDemoDark' : 'IcWalletDerivDemoLight';
        case 'USD':
            return 'IcCurrencyUsd';
        case 'EUR':
            return 'IcCurrencyEur';
        case 'AUD':
            return 'IcCurrencyAud';
        case 'BTC':
            return is_dark_mode_on ? 'IcCashierBitcoinDark' : 'IcCashierBitcoinLight';
        case 'ETH':
            return is_dark_mode_on ? 'IcWalletEtheriumDark' : 'IcWalletEtheriumLight';
        case 'USDT':
            return is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight';
        case 'eUSDT':
            return is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight';
        case 'tUSDT':
            return is_dark_mode_on ? 'IcWalletTetherDark' : 'IcWalletTetherLight';
        case 'LTC':
            return is_dark_mode_on ? 'IcCashierLiteCoinDark' : 'IcCashierLiteCoinLight';
        case 'USDC':
            return is_dark_mode_on ? 'IcCashierUsdCoinDark' : 'IcCashierUsdCoinLight';
        default:
            return 'Unknown';
    }
};

export const getWalletHeaderButtons = (is_demo: boolean) => {
    return is_demo
        ? [
              {
                  name: 'Transfer',
                  text: localize('Transfer'),
                  icon: 'IcAccountTransfer',
                  action: () => {
                      //   console.log('Transfer');
                  },
              },
              {
                  name: 'Transactions',
                  text: localize('Transactions'),
                  icon: 'IcStatement',
                  action: () => {
                      //   console.log('Transactions');
                  },
              },
              {
                  name: 'Deposit',
                  text: localize('Reset balance'),
                  icon: 'IcCashierAdd',
                  action: () => {
                      //   console.log('Reset balance');
                  },
              },
          ]
        : [
              {
                  name: 'Deposit',
                  text: localize('Deposit'),
                  icon: 'IcCashierAdd',
                  action: () => {
                      //   console.log('Deposit');
                  },
              },
              {
                  name: 'Withdraw',
                  text: localize('Withdraw'),
                  icon: 'IcCashierMinus',
                  action: () => {
                      //   console.log('Withdraw');
                  },
              },
              {
                  name: 'Transfer',
                  text: localize('Transfer'),
                  icon: 'IcAccountTransfer',
                  action: () => {
                      //   console.log('Transfer');
                  },
              },
              {
                  name: 'Transactions',
                  text: localize('Transactions'),
                  icon: 'IcStatement',
                  action: () => {
                      //   console.log('Transactions');
                  },
              },
          ];
};
