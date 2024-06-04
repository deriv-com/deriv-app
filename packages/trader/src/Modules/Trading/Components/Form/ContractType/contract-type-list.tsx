import React from 'react';
import Item from './contract-type-item';
import { localize } from '@deriv/translations';
import { TRADE_TYPES } from '@deriv/shared';
import { Text } from '@deriv/components';
import classNames from 'classnames';
import { TContractType, TContractCategory, TFilteredContractType } from './types';

type TListProps = {
    handleSelect?: (
        clicked_item: TContractType,
        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLInputElement>
    ) => void;
    list: TContractCategory[];
    should_show_info_banner?: boolean;
    value?: string;
};

const List = ({ handleSelect, list, should_show_info_banner, value }: TListProps) => (
    <React.Fragment>
        {list.map((contract_category, index) => {
            const tradeTypes = contract_category.contract_types;
            const contract_types = tradeTypes?.reduce<TFilteredContractType[]>((acc, contract_type) => {
                let newValue: string | string[] = contract_type.value;
                const { RISE_FALL, RISE_FALL_EQUAL, TURBOS, VANILLA } = TRADE_TYPES;
                if (contract_type.value === RISE_FALL && tradeTypes.some(c => c.value === RISE_FALL_EQUAL)) {
                    newValue = [RISE_FALL, RISE_FALL_EQUAL];
                }
                if (contract_type.value === TURBOS.LONG && tradeTypes.some(c => c.value === TURBOS.SHORT)) {
                    newValue = [TURBOS.LONG, TURBOS.SHORT];
                }
                if (contract_type.value === VANILLA.CALL && tradeTypes.some(c => c.value === VANILLA.PUT)) {
                    newValue = [VANILLA.CALL, VANILLA.PUT];
                }
                if ([TURBOS.SHORT, VANILLA.PUT, RISE_FALL_EQUAL].includes(contract_type.value)) {
                    return acc;
                }
                return [...acc, { ...contract_type, value: newValue }];
            }, []);

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
                            value={value}
                        />
                    </div>
                </div>
            );
        })}
    </React.Fragment>
);

export default List;
