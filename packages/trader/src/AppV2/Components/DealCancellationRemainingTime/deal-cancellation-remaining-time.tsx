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
                variant='custom'
                label={timestamp}
                icon={LabelPairedStopwatchCaptionRegularIcon}
                size='sm'
                color='custom'
                className='deal-cancellation-badge'
            />
        </React.Fragment>
    );
});

export default DealCancellationRemainingTime;
