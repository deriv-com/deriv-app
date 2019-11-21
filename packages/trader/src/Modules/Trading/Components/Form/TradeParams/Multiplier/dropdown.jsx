import { Dropdown, Money, Popover }   from 'deriv-components';
import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes                      from 'prop-types';
import React                          from 'react';
import Localize                       from 'App/Components/Elements/localize.jsx';
import { localize }                   from 'App/i18n';
import { connect }                    from 'Stores/connect';

const MultiplierDropdown = ({
    amount,
    commission,
    currency,
    multiplier,
    multiplier_range_list,
    onChange,
}) => (
    <div className='trade-container__multiplier'>
        <Dropdown
            id='multiplier'
            className='trade-container__multiplier-dropdown'
            is_alignment_left
            is_nativepicker={false}
            list={multiplier_range_list}
            name='multiplier'
            no_border={true}
            value={multiplier}
            onChange={onChange}
        />
        <Popover
            alignment='left'
            id='dt_multiplier__tooltip'
            message={<Localize
                i18n_default_text='<0>{{commission}}%</0> of (<1/> * {{multiplier}})'
                values={{ commission, multiplier }}
                components={[<span className='bold' key={0} />, <Money key={1} amount={amount} currency={currency} />]}
            />}
        >
            <p className='trade-container__fieldset-tooltip-text'>
                {localize('Commission: {{commission}}%', { commission })}
            </p>
        </Popover>
    </div>
);

MultiplierDropdown.propTypes = {
    amount: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    commission: PropTypes.number,
    currency  : PropTypes.string,
    multiplier: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    multiplier_range_list: MobxPropTypes.arrayOrObservableArray,
    onChange             : PropTypes.func,
};

export default connect(({ modules }) => ({
    amount               : modules.trade.amount,
    commission           : modules.trade.commission,
    currency             : modules.trade.currency,
    multiplier           : modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    onChange             : modules.trade.onChange,
}))(MultiplierDropdown);
