import { PropTypes as MobxPropTypes } from 'mobx-react';
import classNames                     from 'classnames';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import { Icon, IconInfoOutline }      from 'Assets/Common';
import { IconTradeCategory }          from 'Assets/Trading/Categories';

const ContractTypeItem = ({
    contracts,
    name,
    value,
    is_equal,
    handleInfoClick,
    handleSelect,
}) => (
    contracts.map((contract, idx) => (
        <div
            key={idx}
            className={classNames('contract-type-item', {
                'contract-type-item--selected' : value === contract.value,
                'contract-type-item--invisible': (contract.value === 'rise_fall' && is_equal) || (contract.value === 'rise_fall_equal' && !is_equal),
            })}
            name={name}
            value={contract.value}
            onClick={(e) => handleSelect(contract, e)}
        >
            <Icon icon={IconTradeCategory} category={contract.value} className='contract-type-item__icon-wrapper' />
            <span className='contract-type-item__title'>
                {contract.text}
            </span>
            <div id='info-icon' className='contract-type-item__icon' onClick={() => handleInfoClick(contract)}>
                <Icon icon={IconInfoOutline} />
            </div>
        </div>
    ))
);

ContractTypeItem.propTypes = {
    contracts      : MobxPropTypes.arrayOrObservableArray,
    handleInfoClick: PropTypes.func,
    handleSelect   : PropTypes.func,
    is_equal       : PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    name : PropTypes.string,
    value: PropTypes.string,
};

export default ContractTypeItem;
