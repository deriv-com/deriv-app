import React from 'react';
import debounce from 'lodash.debounce';
import { observer } from 'mobx-react-lite';
import { SearchBox } from '@deriv/components';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import FilterPaymentMethodsResults from './filter-payment-method-results';

// TODO: Merge this component with FilterModal once navigation flow is fixed
const FilterPaymentMethods = observer(({ selected_methods, setSelectedMethods }) => {
    const { my_profile_store, my_ads_store } = useStores();
    const filtered_payment_methods = my_profile_store.payment_methods_list.filter(
        payment_method => !selected_methods.includes(payment_method.value)
    );

    const returnedFunction = debounce(() => {
        const searched_payment_methods = filtered_payment_methods.filter(payment_method =>
            payment_method.value.includes(my_ads_store.search_term)
        );
        my_ads_store.setSearchedResults(searched_payment_methods);
        my_ads_store.setIsSearchingPaymentMethod(false);
    }, 1000);

    const onSearch = search => {
        my_ads_store.setSearchTerm(search.trim());

        if (!search.trim()) {
            my_ads_store.setSearchedResults([]);
            return;
        }

        my_ads_store.setIsSearchingPaymentMethod(true);
        returnedFunction();
    };

    const onClear = () => {
        my_ads_store.setSearchTerm('');
        my_ads_store.setSearchedResults([]);
        my_ads_store.setIsSearchingPaymentMethod(false);
    };

    return (
        <div className='filter-payment-methods'>
            <SearchBox
                className='filter-payment-methods__search'
                onClear={onClear}
                onSearch={onSearch}
                placeholder={localize('Search payment method')}
            />
            <FilterPaymentMethodsResults
                filtered_payment_methods={filtered_payment_methods}
                setSelectedMethods={setSelectedMethods}
            />
        </div>
    );
});

export default FilterPaymentMethods;
