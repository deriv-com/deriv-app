import PropTypes                      from 'prop-types';
import React                          from 'react';
import ContractTypeItem               from './contract-type-item.jsx';

const ContractTypeList = ({
    handleInfoClick,
    handleSelect,
    is_equal,
    list = [],
    name,
    value,
}) => (
    Object.keys(list).map(key => (
        <div key={key} className='contract-type-list' >
            <div className='contract-type-list__label'>
                <span>{list[key].label}</span>
            </div>
            <div className='contract-type-list__contracts-wrapper'>
                <ContractTypeItem
                    contracts={list[key].contract_types}
                    handleSelect={handleSelect}
                    handleInfoClick={handleInfoClick}
                    is_equal={is_equal}
                    name={name}
                    value={value}
                />
            </div>
        </div>
    ))
);

ContractTypeList.propTypes = {
    handleInfoClick: PropTypes.func,
    handleSelect   : PropTypes.func,
    is_equal       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    list : PropTypes.array,
    name : PropTypes.string,
    value: PropTypes.string,
};

export default ContractTypeList;
