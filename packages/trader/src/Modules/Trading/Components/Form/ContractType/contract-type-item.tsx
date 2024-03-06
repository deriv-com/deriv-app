import classNames from 'classnames';
import React from 'react';
import { Text } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories';
import { TContractType, TFilteredContractType } from './types';

type TItem = {
    contract_types: TFilteredContractType[];
    handleSelect?: (clicked_item: TContractType, e: React.MouseEvent<HTMLDivElement>) => void;
    value?: string;
};

const Item = ({ contract_types, handleSelect, value }: TItem) => (
    <React.Fragment>
        {contract_types.map(type => {
            const tradeType = { ...type, value: Array.isArray(type.value) ? type.value[0] : type.value };
            return (
                <div
                    id={`dt_contract_${tradeType.value}_item`}
                    data-testid='dt_contract_item'
                    key={tradeType.value}
                    className={classNames('contract-type-item', {
                        'contract-type-item--selected': type.value.includes(value ?? ''),
                    })}
                    onClick={e => handleSelect?.(tradeType, e)}
                >
                    <IconTradeCategory category={tradeType.value} className='contract-type-item__icon-wrapper' />
                    <Text size='xs' className='contract-type-item__title'>
                        {tradeType.text}
                    </Text>
                </div>
            );
        })}
    </React.Fragment>
);

export default Item;
