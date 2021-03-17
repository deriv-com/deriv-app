import { PropTypes as MobxPropTypes } from 'mobx-react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon, DesktopWrapper, Text } from '@deriv/components';
import IconTradeCategory from 'Assets/Trading/Categories/icon-trade-categories.jsx';

const Item = ({ contract_types, handleInfoClick, handleSelect, name, value }) =>
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

Item.propTypes = {
    contract_types: MobxPropTypes.arrayOrObservableArray,
    handleInfoClick: PropTypes.func,
    handleSelect: PropTypes.func,
    name: PropTypes.string,
    value: PropTypes.string,
};

export default Item;
