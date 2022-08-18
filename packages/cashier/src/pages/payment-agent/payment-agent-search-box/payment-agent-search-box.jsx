import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
import CashierSearchBox from 'Components/cashier-search-box';

const PaymentAgentSearchBox = ({ filterPaymentAgentList, setIsSearchLoading, search_term, setSearchTerm }) => {
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
};

PaymentAgentSearchBox.propTypes = {
    filterPaymentAgentList: PropTypes.func,
    setIsSearchLoading: PropTypes.func,
    search_term: PropTypes.string,
    setSearchTerm: PropTypes.string,
};

export default connect(({ modules }) => ({
    filterPaymentAgentList: modules.cashier.payment_agent.filterPaymentAgentList,
    setIsSearchLoading: modules.cashier.payment_agent.setIsSearchLoading,
    search_term: modules.cashier.payment_agent.search_term,
    setSearchTerm: modules.cashier.payment_agent.setSearchTerm,
}))(PaymentAgentSearchBox);
