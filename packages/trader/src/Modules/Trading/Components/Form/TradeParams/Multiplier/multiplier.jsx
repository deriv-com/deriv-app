import { PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from '@deriv/components';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset.jsx';
import { connect } from 'Stores/connect';

const Multiplier = ({ multiplier, multiplier_range_list, onChange }) => {
    return (
        <Fieldset
            className='trade-container__fieldset trade-container__fieldset__multiplier'
            is_center
            header={localize('Multiplier')}
            header_tooltip={localize(
                'Your gross profit is the percentage change in market price times your stake and the multiplier chosen here.'
            )}
        >
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
        </Fieldset>
    );
};

Multiplier.propTypes = {
    multiplier: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    multiplier_range_list: MobxPropTypes.arrayOrObservableArray,
    onChange: PropTypes.func,
};

export default connect(({ modules }) => ({
    multiplier: modules.trade.multiplier,
    multiplier_range_list: modules.trade.multiplier_range_list,
    onChange: modules.trade.onChange,
}))(Multiplier);
