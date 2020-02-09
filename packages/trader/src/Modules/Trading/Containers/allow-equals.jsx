import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import {
    hasCallPutEqual,
    hasDurationForCallPutEqual,
    isRiseFallEqual,
} from 'Stores/Modules/Trading/Helpers/allow-equals';

const AllowEquals = ({
    onChange,
    is_allow_equal,
    className,
    duration_unit,
    contract_types_list,
    contract_type,
    expiry_type,
    contract_start_type,
}) => {
    const has_callputequal_duration = hasDurationForCallPutEqual(
        contract_types_list,
        duration_unit,
        contract_start_type
    );
    const has_callputequal = hasCallPutEqual(contract_types_list);

    const has_allow_equals =
        isRiseFallEqual(contract_type) && (has_callputequal_duration || expiry_type === 'endtime') && has_callputequal;

    const handleOnChange = e => {
        e.persist();
        const { name, checked } = e.target;
        onChange({ target: { name, value: Number(checked) } });
    };

    return (
        has_allow_equals && (
            <div className={classNames('allow-equals', 'mobile-widget', className)}>
                <Checkbox
                    label={localize('Allow Equal')}
                    value={is_allow_equal}
                    name='is_equal'
                    onChange={handleOnChange}
                />
                <p className='allow-equals__subtitle'>
                    <Localize i18n_default_text='Win payout if exit spot is also equal to entry spot.' />
                </p>
            </div>
        )
    );
};

AllowEquals.propTypes = {
    is_allow_equal: PropTypes.bool,
    onChange: PropTypes.func,
};

export default connect(({ modules }) => ({
    is_allow_equal: !!modules.trade.is_equal,
    onChange: modules.trade.onChange,
    duration_unit: modules.trade.duration_unit,
    contract_types_list: modules.trade.contract_types_list,
    contract_type: modules.trade.contract_type,
    expiry_type: modules.trade.expiry_type,
    contract_start_type: modules.trade.contract_start_type,
}))(AllowEquals);
