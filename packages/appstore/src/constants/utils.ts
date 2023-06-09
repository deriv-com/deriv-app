import { useWalletsList } from '@deriv/hooks';
import { isCryptocurrency, isMobile } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TWalletAccount } from 'Types';

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

export const convertWallets = (
    wallets: ReturnType<typeof useWalletsList>['data'],
    is_dark_mode_on: boolean
): TWalletAccount[] => {
    return (
        wallets?.map(wallet => {
            const {
                currency = 'USD',
                account_category,
                account_type,
                balance = 0,
                is_disabled,
                is_virtual,
                landing_company_shortcode,
                loginid = '',
            } = wallet;

            const is_fiat = !isCryptocurrency(currency) && currency !== 'USDT';
            const name = is_virtual ? `Demo ${currency}` : currency;

            return {
                account_category,
                account_type,
                balance,
                currency,
                is_disabled: !!is_disabled,
                is_virtual: !!is_virtual,
                landing_company_shortcode: landing_company_shortcode as 'svg' | 'malta',
                loginid,
                icon: getWalletCurrencyIcon(is_virtual ? 'demo' : currency, is_dark_mode_on),
                icon_type: is_fiat && !is_virtual ? 'fiat' : 'crypto',
                name,
            };
        }) || []
    );
};
