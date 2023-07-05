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
