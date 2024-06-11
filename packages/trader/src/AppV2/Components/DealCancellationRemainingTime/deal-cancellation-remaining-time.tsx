import { Tag } from '@deriv-com/quill-ui';
import { LabelPairedStopwatchCaptionRegularIcon } from '@deriv/quill-icons';
import { formatDuration, getDiffDuration } from '@deriv/shared';
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
        return <React.Fragment>{''}</React.Fragment>;
    }

    const { timestamp } = formatDuration(getDiffDuration(start_time.unix(), end_time), format);

    return (
        <React.Fragment>
            <Tag
                className='deal-cancellation-badge'
                color='custom'
                data-testid='deal-cancellation-badge'
                icon={<LabelPairedStopwatchCaptionRegularIcon />}
                label={timestamp}
                size='sm'
                variant='custom'
            />
        </React.Fragment>
    );
});

export default DealCancellationRemainingTime;
