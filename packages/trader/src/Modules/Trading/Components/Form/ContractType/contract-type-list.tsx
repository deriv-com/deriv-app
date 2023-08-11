import React from 'react';
import Item from './contract-type-item';
import { localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import classNames from 'classnames';
import { TContractType, TContractCategory } from './types';

type TListProps = {
    handleInfoClick?: (clicked_item: TContractType) => void;
    handleSelect?: (
        clicked_item: TContractType,
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLInputElement>
    ) => void;
    list: TContractCategory[];
    value?: string;
};

const List = ({ handleInfoClick, handleSelect, list, value }: TListProps) => (
    <React.Fragment>
        {list.map(contract_category => {
            const contract_types = contract_category.contract_types?.filter(contract_type => {
                const base_contract_type = /^(.*)_equal$/.exec(contract_type.value)?.[1];
                if (contract_type.value === 'turbosshort') return false;
                if (base_contract_type) {
                    return !contract_category.contract_types.some(c => c.value === base_contract_type);
                }

                return true;
            });
            const is_new = /(Accumulators|Turbos|Vanillas)/i.test(contract_category.key);

            return (
                <div key={contract_category.key} className='contract-type-list' data-testid='contract_list'>
                    <div className='contract-type-item__container'>
                        <Text size='xs' className='contract-type-list__label'>
                            {contract_category.label}
                        </Text>
                        {is_new && (
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
                            value={value}
                        />
                    </div>
                </div>
            );
        })}
        ;
    </React.Fragment>
);

export default List;
