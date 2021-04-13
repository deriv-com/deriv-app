import React from 'react';
import { Dropdown } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import 'Components/buy-sell/sort-dropdown.scss';

const SortDropdown = () => {
    const { buy_sell_store } = useStores();

    const [selected_value, setSelectedValue] = React.useState('rate');

    const handleChange = e => {
        buy_sell_store.setIsLoading(true);
        setSelectedValue(e.target.value);
        buy_sell_store.setItems([]);
        buy_sell_store.setSortBy(e.target.value);
        buy_sell_store.loadMoreItems({ startIndex: 0 });
    };

    return (
        <Dropdown
            className='sort-dropdown'
            classNameLabel='sort-dropdown--label'
            is_align_text_left
            list={[
                { text: localize('Exchange rate (Default)'), value: 'rate' },
                { text: localize('Completion rate'), value: 'completion' },
            ]}
            onChange={handleChange}
            placeholder={localize('Sort by')}
            value={selected_value}
        />
    );
};

export default observer(SortDropdown);
