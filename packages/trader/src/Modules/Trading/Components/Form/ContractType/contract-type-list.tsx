import React from 'react';
import Item from './contract-type-item.jsx';

type ListProps = {
    handleInfoClick: () => void;
    handleSelect: () => void;
    list: unknown;
    name: string;
    value: string;
};

const List = ({ handleInfoClick, handleSelect, list, name, value }: ListProps) =>
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
                <div className='contract-type-list__label'>
                    <span>{contract_category.label}</span>
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

export default List;
