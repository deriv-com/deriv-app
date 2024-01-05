import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Dropdown, useOnClickOutside } from '@deriv/components';
import { isMobile } from '@deriv/shared';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import { CurrencySelector } from 'Pages/buy-sell/currency-selector';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import './currency-dropdown.scss';

const CurrencyDropdown = () => {
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
        <div className='currency-dropdown' ref={currency_selector_ref}>
            <Dropdown
                className={classNames('currency-dropdown__list', {
                    'currency-dropdown__list--visible': is_list_visible,
                })}
                is_align_text_left
                list={local_currencies}
                onClick={() => {
                    if (isMobile()) showModal({ key: 'CurrencySelectorModal' });
                    else setIsListVisible(!is_list_visible);
                }}
                placeholder={localize('Currency')}
                value={selected_local_currency}
            />
            {is_list_visible && (
                <CurrencySelector
                    default_value={selected_local_currency}
                    list={local_currencies}
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
