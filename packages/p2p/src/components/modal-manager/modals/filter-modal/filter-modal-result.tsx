import React from 'react';
import { Checkbox, Loading } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useStores } from 'Stores';
import { TPaymentMethod } from './filter-modal';
import FilterModalNoResults from './filter-modal-no-results';

type TFilterModalResultProps = {
    onChange: (payment_method: TPaymentMethod) => void;
    selected_methods: string[];
};

const FilterModalResult = ({ onChange, selected_methods }: TFilterModalResultProps) => {
    const { buy_sell_store, my_profile_store } = useStores();
    const { is_filter_modal_loading } = buy_sell_store;
    const { payment_methods_list_items, search_results, search_term } = my_profile_store;

    if (is_filter_modal_loading) return <Loading is_fullscreen={false} />;
    else if (search_term) {
        if (search_results?.length > 0) {
            return search_results?.map((payment_method: TPaymentMethod, key: number) => {
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
        return <FilterModalNoResults text={search_term} />;
    }
    return payment_methods_list_items?.map((payment_method: TPaymentMethod, key: number) => {
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

export default observer(FilterModalResult);
