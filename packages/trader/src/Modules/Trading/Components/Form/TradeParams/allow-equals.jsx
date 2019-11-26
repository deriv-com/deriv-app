import { Popover, Checkbox }    from 'deriv-components';
import React                    from 'react';
import PropTypes                from 'prop-types';
import { localize }             from 'deriv-translations';
import {
    hasCallPutEqual,
    hasDurationForCallPutEqual,
    isRiseFallEqual }           from 'Stores/Modules/Trading/Helpers/allow-equals';

const AllowEquals = ({
    contract_start_type,
    contract_type,
    contract_types_list,
    duration_unit,
    expiry_type,
    onChange,
    value,
}) => {
    const has_callputequal_duration = hasDurationForCallPutEqual(contract_types_list,
        duration_unit, contract_start_type);
    const has_callputequal          = hasCallPutEqual(contract_types_list);

    const has_allow_equals = isRiseFallEqual(contract_type) &&
            ((has_callputequal_duration || expiry_type === 'endtime') && has_callputequal);

    const changeValue = (e) => {
        e.persist();
        const { name, checked } = e.target;
        onChange({ target: { name, value: Number(checked) } });
    };

    return (
        has_allow_equals &&
            <div className='allow-equals'>
                <Checkbox
                    className='allow-equals__input-field'
                    id='dt_allow_equals_input'
                    onChange={changeValue}
                    defaultChecked={value}
                    name='is_equal'
                    label={localize('Allow equals')}
                    classNameLabel='allow-equals__label'
                />
                <Popover
                    alignment='left'
                    classNameTarget='allow-equals__tooltip'
                    icon='info'
                    id='dt_allow_equals_info'
                    message={localize('Win payout if exit spot is also equal to entry spot.')}
                    margin={113}
                />
            </div>
    );
};

AllowEquals.propTypes = {
    contract_start_type: PropTypes.string,
    contract_type      : PropTypes.string,
    contract_types_list: PropTypes.object,
    duration_unit      : PropTypes.string,
    expiry_type        : PropTypes.string,
    onChange           : PropTypes.func,
    value              : PropTypes.number,
};

export default AllowEquals;
