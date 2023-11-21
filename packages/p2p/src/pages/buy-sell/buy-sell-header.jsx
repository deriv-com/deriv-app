import * as React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle, Icon, SearchBox } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { buy_sell } from 'Constants/buy-sell';
import { useP2PRenderedAdverts } from 'Hooks';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/toggle-container';
import SortDropdown from 'Pages/buy-sell/sort-dropdown';
import { useStores } from 'Stores';
import CurrencyDropdown from 'Pages/buy-sell/currency-dropdown.jsx';
import 'Pages/buy-sell/buy-sell-header.scss';

const getBuySellFilters = () => [
    {
        text: localize('Buy'),
        value: buy_sell.BUY,
    },
    {
        text: localize('Sell'),
        value: buy_sell.SELL,
    },
];

const BuySellHeader = ({ table_type, clearScroll, scroll_to_index }) => {
    const { buy_sell_store, general_store } = useStores();
    const is_currency_selector_visible = general_store.feature_level >= 2;

    const onClear = () => {
        buy_sell_store.setSearchTerm('');
    };

    const onSearch = search => {
        buy_sell_store.setSearchTerm(search.trim());
    };

    React.useEffect(
        () => {
            buy_sell_store.setSearchTerm('');

            const interval = setInterval(() => {
                buy_sell_store.getWebsiteStatus();
            }, 60000);

            return () => {
                if (interval) clearInterval(interval);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const handleTabChange = values => {
        clearScroll();
        buy_sell_store.onChangeTableType(values);
    };

    const { isError } = useP2PRenderedAdverts({ limit: scroll_to_index });

    return (
        <div
            className={classNames('buy-sell-header', {
                'buy-sell-header__position-static': isError,
            })}
        >
            <div className='buy-sell-header__container'>
                <ToggleContainer>
                    <ButtonToggle
                        buttons_arr={getBuySellFilters()}
                        className='buy-sell-header__filters'
                        is_animated
                        name='filter'
                        onChange={handleTabChange}
                        value={table_type}
                        has_rounded_button
                    />
                </ToggleContainer>
                <div
                    className={classNames('buy-sell-header__row', {
                        'buy-sell-header__row--selector': is_currency_selector_visible,
                    })}
                >
                    {is_currency_selector_visible && <CurrencyDropdown />}
                    <SearchBox
                        onClear={onClear}
                        onSearch={onSearch}
                        placeholder={isDesktop() ? localize('Search by nickname') : localize('Search')}
                    />
                    <SortDropdown />
                    <div className='buy-sell-header__row--filter'>
                        <div
                            className={classNames('buy-sell-header__row--filter-status', {
                                'buy-sell-header__row--filter-status--disabled':
                                    buy_sell_store.selected_payment_method_value.length === 0,
                            })}
                        />
                        <Icon
                            icon='IcFilter'
                            className='buy-sell-header__row--filter-icon'
                            onClick={() => general_store.showModal({ key: 'FilterModal', props: {} })}
                            size={40}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

BuySellHeader.propTypes = {
    table_type: PropTypes.string,
    clearScroll: PropTypes.func,
    scroll_to_index: PropTypes.number,
};

export default observer(BuySellHeader);
