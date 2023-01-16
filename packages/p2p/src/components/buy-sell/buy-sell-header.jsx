import * as React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import { ButtonToggle, Icon } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { buy_sell } from 'Constants/buy-sell';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/misc/toggle-container.jsx';
import SearchBox from 'Components/search-box';
import SortDropdown from 'Components/buy-sell/sort-dropdown.jsx';
import { useStores } from 'Stores';
import CurrencyDropdown from 'Components/buy-sell/currency-dropdown.jsx';
import 'Components/buy-sell/buy-sell-header.scss';

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

const BuySellHeader = ({ table_type }) => {
    const { buy_sell_store, general_store } = useStores();
    const is_currency_selector_visible = general_store.feature_level >= 2;

    const returnedFunction = debounce(() => {
        buy_sell_store.loadMoreItems({ startIndex: 0 });
    }, 1000);

    const onClear = () => {
        buy_sell_store.setSearchTerm('');
        buy_sell_store.setSearchResults([]);
    };

    const onSearch = search => {
        buy_sell_store.setSearchTerm(search.trim());

        if (!search.trim()) {
            buy_sell_store.setSearchResults([]);
            return;
        }

        buy_sell_store.setIsLoading(true);
        returnedFunction();
    };

    React.useEffect(
        () => {
            buy_sell_store.setSearchTerm('');
            buy_sell_store.setItems([]);
            buy_sell_store.setIsLoading(true);
            buy_sell_store.loadMoreItems({ startIndex: 0 });

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

    return (
        <div
            className={classNames('buy-sell__header', {
                'buy-sell__header-position-static': !!buy_sell_store.api_error_message,
            })}
        >
            <div className='buy-sell__header-container'>
                <ToggleContainer>
                    <ButtonToggle
                        buttons_arr={getBuySellFilters()}
                        className='buy-sell__header-filters'
                        is_animated
                        name='filter'
                        onChange={buy_sell_store.onChangeTableType}
                        value={table_type}
                        has_rounded_button
                    />
                </ToggleContainer>
                <div
                    className={classNames('buy-sell__header-row', {
                        'buy-sell__header-row--selector': is_currency_selector_visible,
                    })}
                >
                    {is_currency_selector_visible && <CurrencyDropdown />}
                    <SearchBox
                        onClear={onClear}
                        onSearch={onSearch}
                        placeholder={isDesktop() ? localize('Search by nickname') : localize('Search')}
                    />
                    <SortDropdown />
                    <Icon
                        className='buy-sell__header-row--filter'
                        icon='IcFilter'
                        onClick={() => buy_sell_store.setIsFilterModalOpen(true)}
                        size={40}
                    />
                </div>
            </div>
        </div>
    );
};

BuySellHeader.propTypes = {
    table_type: PropTypes.string,
};

export default observer(BuySellHeader);
