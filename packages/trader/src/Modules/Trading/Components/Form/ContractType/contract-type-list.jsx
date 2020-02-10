import PropTypes from 'prop-types';
import React from 'react';
import Item from './contract-type-item.jsx';

const List = ({ handleInfoClick, handleSelect, is_equal, list, name, value }) =>
    list.map((contract_category, key) => (
        <div key={key} className='contract-type-list'>
            <div className='contract-type-list__label'>
                <span>{contract_category.label}</span>
            </div>
            <div className='contract-type-list__wrapper'>
                <Item
                    contract_types={contract_category.contract_types}
                    handleSelect={handleSelect}
                    handleInfoClick={handleInfoClick}
                    is_equal={is_equal}
                    name={name}
                    value={value}
                />
            </div>
        </div>
    ));

List.propTypes = {
    handleInfoClick: PropTypes.func,
    handleSelect: PropTypes.func,
    is_equal: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    list: PropTypes.array,
    name: PropTypes.string,
    value: PropTypes.string,
};

export default List;
