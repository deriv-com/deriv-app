import React from 'react';
import Item from './contract-type-item';
import { localize } from '@deriv/translations';
import { TRADE_TYPES } from '@deriv/shared';
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
    should_show_info_banner?: boolean;
    value?: string;
};

const List = ({ handleInfoClick, handleSelect, list, should_show_info_banner, value }: TListProps) => (
    <React.Fragment>
        {list.map((contract_category, index) => {
            const contract_types = contract_category.contract_types?.filter(contract_type => {
                const base_contract_type = /^(.*)_equal$/.exec(contract_type.value)?.[1];
                const { TURBOS, VANILLA } = TRADE_TYPES;
                if (contract_type.value === TURBOS.SHORT || contract_type.value === VANILLA.PUT) {
                    return false;
                }
                if (base_contract_type) {
                    return !contract_category.contract_types.some(c => c.value === base_contract_type);
                }

                return true;
            });
            const is_new = /(Accumulators|Turbos|Vanillas)/i.test(contract_category.key);

            return (
                <div
                    key={contract_category.key}
                    className={classNames('contract-type-list', {
                        'contract-type-list--unavailable-category': contract_category.is_unavailable,
                        'contract-type-list--no-top-padding': should_show_info_banner && index === 0,
                    })}
                    data-testid='dt_contract_list'
                >
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
                            handleSelect={contract_category.is_unavailable ? undefined : handleSelect}
                            handleInfoClick={contract_category.is_unavailable ? undefined : handleInfoClick}
                            value={value}
                        />
                    </div>
                </div>
            );
        })}
    </React.Fragment>
);

export default List;
