import { PropTypes as MobxPropTypes } from 'mobx-react';
import React from 'react';
import { Dropdown } from '@deriv/components';
import { connect } from 'Stores/connect';

type MultiplierProps = {
    multiplier: unknown | number | string;
    multiplier_range_list: unknown;
    onChange: () => void;
};

const Multiplier = ({ multiplier, multiplier_range_list, onChange }: MultiplierProps) => {
    return (
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
    );
};

export default connect(({ modules }) => ({
    multiplier: modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    onChange: modules.trade.onChange,
}))(Multiplier);
