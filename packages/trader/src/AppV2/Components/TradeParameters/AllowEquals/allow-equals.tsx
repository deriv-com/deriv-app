import React from 'react';
import clsx from 'clsx';
import { TextField } from '@deriv-com/quill-ui';
import { localize, Localize } from '@deriv/translations';
import { hasCallPutEqual, hasDurationForCallPutEqual } from 'Stores/Modules/Trading/Helpers/allow-equals';
import { useTraderStore } from 'Stores/useTraderStores';

type TAllowEqualsProps = {
    is_minimized?: boolean;
} & Pick<
    ReturnType<typeof useTraderStore>,
    'contract_start_type' | 'contract_types_list' | 'duration_unit' | 'expiry_type' | 'is_equal'
>;

const AllowEquals = ({
    contract_types_list,
    contract_start_type,
    duration_unit,
    expiry_type,
    is_equal,
    is_minimized,
}: TAllowEqualsProps) => {
    const has_callputequal_duration = hasDurationForCallPutEqual(
        contract_types_list,
        duration_unit,
        contract_start_type
    );
    const has_callputequal = hasCallPutEqual(contract_types_list);
    const has_allow_equals = (has_callputequal_duration || expiry_type === 'endtime') && has_callputequal;

    if (!has_allow_equals) return null;
    return (
        <TextField
            variant='fill'
            readOnly
            label={<Localize i18n_default_text='Allow equals' />}
            value={is_equal ? localize('Enabled') : '-'}
            className={clsx('trade-params__option', is_minimized && 'trade-params__option--minimized')}
        />
    );
};

export default AllowEquals;
