import * as React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Checkbox, Loading } from '@deriv/components';
import FilterModalNoResults from './filter-modal-no-results.jsx';
import { useStores } from 'Stores';

const FilterModalResult = ({ onChange, selected_methods }) => {
    const { buy_sell_store, my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.setSearchTerm('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (buy_sell_store.is_filter_modal_loading || !my_profile_store.search_results) {
        return <Loading is_fullscreen={false} />;
    } else if (my_profile_store.search_term) {
        if (!my_profile_store.search_results || my_profile_store.search_results.length > 0) {
            return my_profile_store.search_results?.map((payment_method, key) => {
                return (
                    <Checkbox
                        key={key}
                        label={payment_method.text}
                        onChange={() => onChange(payment_method)}
                        value={selected_methods.includes(payment_method.value)}
                    />
                );
            });
        }
        return <FilterModalNoResults text={my_profile_store.search_term} />;
    }
    return my_profile_store.payment_methods_list_items.map((payment_method, key) => {
        return (
            <Checkbox
                name='checkbox'
                key={key}
                label={payment_method.text}
                onChange={() => onChange(payment_method)}
                value={selected_methods.includes(payment_method.value)}
            />
        );
    });
};

FilterModalResult.propTypes = {
    onChange: PropTypes.func,
    selected_methods: PropTypes.array,
};

export default observer(FilterModalResult);
