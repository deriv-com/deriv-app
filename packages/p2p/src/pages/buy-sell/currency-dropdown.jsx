import React from 'react';
import classNames from 'classnames';
import { Dropdown, useOnClickOutside } from '@deriv/components';
import { useP2PSettings } from '@deriv/hooks';
import { isMobile } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { CurrencySelector } from 'Pages/buy-sell/currency-selector';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import './currency-dropdown.scss';

const CurrencyDropdown = () => {
    const [is_list_visible, setIsListVisible] = React.useState(false);
    const currency_selector_ref = React.useRef(null);
    const { buy_sell_store } = useStores();
    const { onLocalCurrencySelect } = buy_sell_store;
    const { showModal } = useModalManagerContext();
    const { p2p_settings } = useP2PSettings();

    useOnClickOutside(
        currency_selector_ref,
        () => {
            setIsListVisible(false);
        },
        () => is_list_visible
    );

    return (
        <div className='currency-dropdown' ref={currency_selector_ref}>
            <Dropdown
                className={classNames('currency-dropdown__list', {
                    'currency-dropdown__list--visible': is_list_visible,
                })}
                list={p2p_settings.local_currencies}
                onClick={() => {
                    if (isMobile()) showModal({ key: 'CurrencySelectorModal' });
                    else setIsListVisible(!is_list_visible);
                }}
                value={buy_sell_store.selected_local_currency}
            />
            {is_list_visible && (
                <CurrencySelector
                    default_value={buy_sell_store.selected_local_currency}
                    list={p2p_settings.local_currencies}
                    onSelect={value => {
                        setIsListVisible(false);
                        onLocalCurrencySelect(value);
                    }}
                />
            )}
        </div>
    );
};

export default observer(CurrencyDropdown);
