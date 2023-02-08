import React from 'react';
import debounce from 'lodash.debounce';
import { observer, useStore } from '@deriv/stores';
import { localize } from '@deriv/translations';
import CashierSearchBox from 'Components/cashier-search-box';

const PaymentAgentSearchBox = observer(() => {
    const {
        modules: {
            cashier: { payment_agent },
        },
    } = useStore();

    const { filterPaymentAgentList, setIsSearchLoading, search_term, setSearchTerm } = payment_agent;

    const debouncedFunction = debounce(() => {
        filterPaymentAgentList();
    }, 500);

    const onClear = () => {
        setSearchTerm('');
        filterPaymentAgentList();
    };

    const onSearch = search => {
        setSearchTerm(search.trim());
        debouncedFunction();
    };

    return (
        <CashierSearchBox
            onClear={onClear}
            onSearch={onSearch}
            placeholder={localize('Search payment agent name')}
            search_term={search_term}
            setIsSearchLoading={setIsSearchLoading}
        />
    );
});

export default PaymentAgentSearchBox;
