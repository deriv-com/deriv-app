import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToggle } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const TradeTypeTabs = ({ className, onChange, contract_type }) => {
    const tab_list = [
        { text: localize('Long'), value: 'turboslong' },
        { text: localize('Short'), value: 'turbosshort' },
    ];

    if (contract_type !== 'turbosshort' && contract_type !== 'turboslong') return null;

    return (
        <div className={classNames('trade-container__trade', 'trade-container__trade-type-tabs', className)}>
            <ButtonToggle
                id='dt_advanced_duration_toggle'
                buttons_arr={tab_list}
                name='contract_type'
                className='trade-container__trade-type-tabs--button'
                is_animated
                onChange={onChange}
                value={tab_list.find(tab => tab.value === contract_type)?.value}
            />
        </div>
    );
};

TradeTypeTabs.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    contract_type: PropTypes.string,
};

export default connect(({ modules }) => ({
    onChange: modules.trade.onChange,
    contract_type: modules.trade.contract_type,
}))(TradeTypeTabs);
