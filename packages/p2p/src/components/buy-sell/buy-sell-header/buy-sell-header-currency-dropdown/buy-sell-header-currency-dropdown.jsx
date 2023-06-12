import React from 'react';
import classNames from 'classnames';
import { Dropdown, useOnClickOutside } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import BuySellHeaderCurrencySelector from 'Components/buy-sell/buy-sell-header/buy-sell-header-currency-selector';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';

const BuySellHeaderCurrencyDropdown = () => {
    const [is_list_visible, setIsListVisible] = React.useState(false);
    const currency_selector_ref = React.useRef(null);
    const { buy_sell_store } = useStores();
    const { local_currencies, onLocalCurrencySelect, selected_local_currency } = buy_sell_store;
    const { showModal } = useModalManagerContext();

    useOnClickOutside(
        currency_selector_ref,
        () => {
            setIsListVisible(false);
        },
        () => is_list_visible
    );

    return (
        <div className='buy-sell-currency-dropdown' ref={currency_selector_ref}>
            <Dropdown
                className={classNames('buy-sell-currency-dropdown__list', {
                    'buy-sell-currency-dropdown__list--visible': is_list_visible,
                })}
                list={local_currencies}
                onClick={() => {
                    if (isMobile()) showModal({ key: 'CurrencySelectorModal' });
                    else setIsListVisible(!is_list_visible);
                }}
                value={selected_local_currency}
            />
            {is_list_visible && (
                <BuySellHeaderCurrencySelector
                    default_value={selected_local_currency}
                    list={local_currencies}
                    onSelect={value => {
                        onLocalCurrencySelect(value);
                        setIsListVisible(false);
                    }}
                />
            )}
        </div>
    );
};

export default observer(BuySellHeaderCurrencyDropdown);
