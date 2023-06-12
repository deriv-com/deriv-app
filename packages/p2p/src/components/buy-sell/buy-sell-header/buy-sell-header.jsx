import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { ButtonToggle, Icon, SearchBox } from '@deriv/components';
import { isDesktop } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { buy_sell } from 'Constants/buy-sell';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/misc/toggle-container.jsx';
import BuySellHeaderCurrencyDropdown from 'Components/buy-sell/buy-sell-header/buy-sell-header-currency-dropdown';
import BuySellHeaderDropdown from 'Components/buy-sell/buy-sell-header/buy-sell-header-dropdown';
import { useStores } from 'Stores';

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
    const {
        api_error_message,
        getWebsiteStatus,
        loadMoreItems,
        onChangeTableType,
        setIsLoading,
        setItems,
        setSearchResults,
        setSearchTerm,
    } = buy_sell_store;
    const { feature_level, showModal } = general_store;
    const is_currency_selector_visible = feature_level >= 2;

    const returnedFunction = debounce(() => {
        loadMoreItems({ startIndex: 0 });
    }, 1000);

    const onClear = () => {
        setSearchTerm('');
        setSearchResults([]);
    };

    const onSearch = search => {
        setSearchTerm(search.trim());

        if (!search.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        returnedFunction();
    };

    React.useEffect(
        () => {
            setSearchTerm('');
            setItems([]);
            setIsLoading(true);
            loadMoreItems({ startIndex: 0 });

            const interval = setInterval(() => {
                getWebsiteStatus();
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
                'buy-sell__header-position-static': !!api_error_message,
            })}
        >
            <div className='buy-sell__header-container'>
                <ToggleContainer>
                    <ButtonToggle
                        buttons_arr={getBuySellFilters()}
                        className='buy-sell__header-filters'
                        is_animated
                        name='filter'
                        onChange={onChangeTableType}
                        value={table_type}
                        has_rounded_button
                    />
                </ToggleContainer>
                <div
                    className={classNames('buy-sell__header-row', {
                        'buy-sell__header-row--selector': is_currency_selector_visible,
                    })}
                >
                    {is_currency_selector_visible && <BuySellHeaderCurrencyDropdown />}
                    <SearchBox
                        onClear={onClear}
                        onSearch={onSearch}
                        placeholder={isDesktop() ? localize('Search by nickname') : localize('Search')}
                    />
                    <BuySellHeaderDropdown />
                    <Icon
                        className='buy-sell__header-row--filter'
                        icon='IcFilter'
                        onClick={() => showModal({ key: 'FilterModal', props: {} })}
                        size={40}
                    />
                </div>
            </div>
        </div>
    );
};

export default observer(BuySellHeader);
