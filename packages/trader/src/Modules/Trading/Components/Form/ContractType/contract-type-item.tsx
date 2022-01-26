import { PropTypes as MobxPropTypes } from 'mobx-react';
import classNames from 'classnames';
import React from 'react';
import { Icon, DesktopWrapper, Text } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories.jsx';

type ItemProps = {
    contract_types: unknown;
    handleInfoClick: () => void;
    handleSelect: () => void;
    name: string;
    value: string;
};

const Item = ({ contract_types, handleInfoClick, handleSelect, name, value }: ItemProps) =>
    contract_types.map((type, idx) => (
        <div
            id={`dt_contract_${type.value}_item`}
            key={idx}
            className={classNames('contract-type-item', {
                'contract-type-item--selected': value === type.value,
            })}
            name={name}
            value={type.value}
            onClick={e => handleSelect(type, e)}
        >
            <IconTradeCategory category={type.value} className='contract-type-item__icon-wrapper' />
            <Text size='xs' className='contract-type-item__title'>
                {type.text}
            </Text>
            <DesktopWrapper>
                <div id='info-icon' className='contract-type-item__icon' onClick={() => handleInfoClick(type)}>
                    <Icon icon='IcInfoOutline' />
                </div>
            </DesktopWrapper>
        </div>
    ));

export default Item;
