import * as React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle, Icon } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import { buy_sell } from 'Constants/buy-sell';
import { localize } from 'Components/i18next';
import ToggleContainer from 'Components/misc/toggle-container.jsx';
import SearchBox from 'Components/buy-sell/search-box.jsx';
import SortDropdown from 'Components/buy-sell/sort-dropdown.jsx';
import { useStores } from 'Stores';
import AnimationWrapper from 'Components/misc/animation-wrapper.jsx';
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

const BuySellHeader = ({ is_visible, table_type, setTableType }) => {
    const { buy_sell_store } = useStores();

    const onChangeTableType = event => setTableType(event.target.value);

    React.useEffect(
        () => {
            buy_sell_store.setSearchTerm('');
            buy_sell_store.setItems([]);
            buy_sell_store.setIsLoading(true);
            buy_sell_store.loadMoreItems({ startIndex: 0 });
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
                <AnimationWrapper is_visible={is_visible}>
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
                </AnimationWrapper>
                <div className='buy-sell__header-row'>
                    <SearchBox />
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
    setTableType: PropTypes.func,
};

export default observer(BuySellHeader);
