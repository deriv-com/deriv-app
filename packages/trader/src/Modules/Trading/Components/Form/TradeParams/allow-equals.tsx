import React from 'react';
import { Popover, Checkbox } from '@deriv/components';
import { localize } from '@deriv/translations';
import {
    hasCallPutEqual,
    hasDurationForCallPutEqual,
    isRiseFallEqual,
} from 'Stores/Modules/Trading/Helpers/allow-equals';
import { useTraderStore } from 'Stores/useTraderStores';

type TTradeStore = Pick<
    ReturnType<typeof useTraderStore>,
    | 'contract_start_type'
    | 'contract_type'
    | 'contract_types_list'
    | 'duration_unit'
    | 'expiry_type'
    | 'has_equals_only'
>;

type TAllowEquals = TTradeStore & {
    onChange: (e: { target: { name: string; value: number } }) => Promise<void> | void;
    value: number;
};

const AllowEquals = ({
    contract_start_type,
    contract_type,
    contract_types_list,
    duration_unit,
    expiry_type,
    onChange,
    value,
    has_equals_only,
}: TAllowEquals) => {
    const has_callputequal_duration = hasDurationForCallPutEqual(
        contract_types_list,
        duration_unit,
        contract_start_type
    );
    const has_callputequal = hasCallPutEqual(contract_types_list);

    const has_allow_equals =
        isRiseFallEqual(contract_type) && (has_callputequal_duration || expiry_type === 'endtime') && has_callputequal;

    const changeValue: React.ComponentProps<typeof Checkbox>['onChange'] = e => {
        e.persist();
        if ('checked' in e.target) {
            const { name, checked } = e.target;
            onChange({ target: { name, value: Number(checked) } });
        }
    };

    return (
        has_allow_equals && (
            <div className='allow-equals'>
                <Checkbox
                    className='allow-equals__input-field'
                    id='dt_allow_equals_input'
                    onChange={changeValue}
                    defaultChecked={!!value}
                    name='is_equal'
                    label={localize('Allow equals')}
                    classNameLabel='allow-equals__label'
                    disabled={has_equals_only}
                />
                <Popover
                    alignment='left'
                    classNameTarget='allow-equals__tooltip'
                    icon='info'
                    id='dt_allow_equals_info'
                    message={localize('Win payout if exit spot is also equal to entry spot.')}
                    margin={130}
                    relative_render
                />
            </div>
        )
    );
};

export default AllowEquals;
