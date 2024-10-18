import React from 'react';
import clsx from 'clsx';
import { observer } from '@deriv/stores';
import { Skeleton } from '@deriv/components';
import { useTraderStore } from 'Stores/useTraderStores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';

const BarrierInfo = observer(({ is_disabled }: { is_disabled?: boolean }) => {
    const { barrier_1, contract_type, proposal_info } = useTraderStore();
    const contract_key = contract_type.toUpperCase();
    const has_error = proposal_info[contract_key]?.has_error;

    if (has_error) return null;
    return (
        <div className='barrier-info__container'>
            <Text size='sm' className={clsx(is_disabled && 'trade-params__text--disabled')}>
                <Localize i18n_default_text='Barrier' />
            </Text>
            {barrier_1 ? (
                <Text size='sm' bold className={clsx(is_disabled && 'trade-params__text--disabled')}>
                    {barrier_1}
                </Text>
            ) : (
                <Skeleton width={50} height={14} />
            )}
        </div>
    );
});

export default BarrierInfo;
