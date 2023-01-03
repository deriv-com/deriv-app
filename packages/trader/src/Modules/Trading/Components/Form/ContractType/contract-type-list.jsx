import PropTypes from 'prop-types';
import React from 'react';
import Item from './contract-type-item.jsx';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import classNames from 'classnames';

const List = ({ handleInfoClick, handleSelect, list, name, value }) =>
    list.map((contract_category, key) => {
        const contract_types = contract_category.contract_types?.filter(contract_type => {
            const base_contract_type = /^(.*)_equal$/.exec(contract_type.value)?.[1];

            if (base_contract_type) {
                return !contract_category.contract_types.some(c => c.value === base_contract_type);
            }

            return true;
        });

        return (
            <div key={key} className='contract-type-list' data-testid='contract_list'>
                <div className='contract-type-item__container'>
                    <Text size='xs' className='contract-type-list__label'>
                        {contract_category.label}
                    </Text>
                    {contract_category.key === 'Vanillas' && (
                        <span className={classNames('dc-vertical-tab__header--new', 'contract-type-item__new')}>
                            {localize('NEW!')}
                        </span>
                    )}
                </div>
                <div className='contract-type-list__wrapper'>
                    <Item
                        contract_types={contract_types}
                        handleSelect={handleSelect}
                        handleInfoClick={handleInfoClick}
                        name={name}
                        value={value}
                    />
                </div>
            </div>
        );
    });

List.propTypes = {
    handleInfoClick: PropTypes.func,
    handleSelect: PropTypes.func,
    list: PropTypes.array,
    name: PropTypes.string,
    value: PropTypes.string,
};

export default List;
