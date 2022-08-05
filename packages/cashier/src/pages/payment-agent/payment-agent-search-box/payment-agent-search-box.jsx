import PropTypes from 'prop-types';
import React from 'react';
import debounce from 'lodash.debounce';
import { connect } from 'Stores/connect';
import { localize } from '@deriv/translations';
import CashierSearchBox from 'Components/cashier-search-box';

const PaymentAgentSearchBox = ({ filterPaymentAgentList, setIsSearchLoading, setSearchTerm }) => {
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
            setIsSearchLoading={setIsSearchLoading}
        />
    );
};

PaymentAgentSearchBox.propTypes = {
    filterPaymentAgentList: PropTypes.func,
    setIsSearchLoading: PropTypes.func,
    setSearchTerm: PropTypes.string,
};

export default connect(({ modules }) => ({
    filterPaymentAgentList: modules.cashier.payment_agent.filterPaymentAgentList,
    setIsSearchLoading: modules.cashier.payment_agent.setIsSearchLoading,
    setSearchTerm: modules.cashier.payment_agent.setSearchTerm,
}))(PaymentAgentSearchBox);
