import { Tag } from '@deriv-com/quill-ui';
import { RemainingTime } from '@deriv/components';
import { getCardLabelsV2 } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import useContractDetails from 'AppV2/Hooks/useContractDetails';
import React from 'react';

type DealCancellationRemainingTimeProps = {
    format?: string;
};

const DealCancellationRemainingTime = observer(({ format = 'mm:ss' }: DealCancellationRemainingTimeProps) => {
    const { common } = useStore();
    const { server_time: start_time } = common;
    const { contract_info } = useContractDetails();

    const { date_expiry: end_time } = contract_info.cancellation || {};
    if (!end_time || start_time.unix() > +end_time) {
        return null;
    }

    return (
        <Tag
            className='deal-cancellation-badge'
            color='custom'
            data-testid='deal-cancellation-badge'
            label={
                <RemainingTime
                    end_time={end_time}
                    format='mm:ss'
                    getCardLabels={getCardLabelsV2}
                    start_time={start_time}
                />
            }
            size='sm'
            variant='custom'
        />
    );
});

export default DealCancellationRemainingTime;
