import React from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
import CashierSearchBox from 'Components/cashier-search-box';
import { TRootStore } from 'Types';

type PaymentAgentSearchBoxProps = {
    filterPaymentAgentList: () => void;
    search_term: string;
    setIsSearchLoading: () => void;
    setSearchTerm: (term: string) => void;
};

const PaymentAgentSearchBox = ({
    filterPaymentAgentList,
    search_term,
    setIsSearchLoading,
    setSearchTerm,
}: PaymentAgentSearchBoxProps) => {
    const debouncedFunction = debounce(() => {
        filterPaymentAgentList();
    }, 500);

    const onClear = () => {
        setSearchTerm('');
        filterPaymentAgentList();
    };

    const onSearch = (search: string) => {
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
};

export default connect(({ modules }: TRootStore) => ({
    filterPaymentAgentList: modules.cashier.payment_agent.filterPaymentAgentList,
    setIsSearchLoading: modules.cashier.payment_agent.setIsSearchLoading,
    search_term: modules.cashier.payment_agent.search_term,
    setSearchTerm: modules.cashier.payment_agent.setSearchTerm,
}))(PaymentAgentSearchBox);
