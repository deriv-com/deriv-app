import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'Stores/connect';
import ContractTypeWidget from '../Components/Form/ContractType';
import { getAvailableContractTypes, unsupported_contract_types_list } from '../Helpers/contract-type';

const Contract = ({ contract_type, contract_types_list, is_equal, onChange }) => {
    const list = getAvailableContractTypes(contract_types_list, unsupported_contract_types_list);

    return (
        <ContractTypeWidget
            is_equal={is_equal}
            list={list}
            name='contract_type'
            onChange={onChange}
            value={contract_type}
        />
    );
};

Contract.propTypes = {
    contract_type: PropTypes.string,
    contract_types_list: PropTypes.object,
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
};

export default connect(({ modules }) => ({
    contract_type: modules.trade.contract_type,
    contract_types_list: modules.trade.contract_types_list,
    is_equal: modules.trade.is_equal,
    onChange: modules.trade.onChange,
}))(Contract);
