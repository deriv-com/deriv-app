import React from 'react';
import { TPortfolioPosition } from '@deriv/stores/types';
import { Localize } from '@deriv/translations';
import { CaptionText } from '@deriv-com/quill-ui';
import { LabelPairedStopwatchCaptionRegularIcon } from '@deriv/quill-icons';
import { getCardLabels } from '@deriv/shared';
import { RemainingTime } from '@deriv/components';
import { TRootStore } from 'Types';

export type TContractCardStatusTimerProps = Pick<TPortfolioPosition['contract_info'], 'date_expiry' | 'tick_count'> & {
    currentTick?: number | null;
    hasNoAutoExpiry?: boolean;
    isSold?: boolean;
    serverTime: TRootStore['common']['server_time'];
};

export const ContractCardStatusTimer = ({
    currentTick,
    date_expiry,
    hasNoAutoExpiry,
    isSold,
    serverTime,
    tick_count,
}: TContractCardStatusTimerProps) => {
    const getDisplayedDuration = () => {
        if (hasNoAutoExpiry) return <Localize i18n_default_text='Ongoing' />;
        if (tick_count) {
            return `${currentTick ?? 0}/${tick_count} ${getCardLabels().TICKS.toLowerCase()}`;
        }
        return <RemainingTime end_time={date_expiry} getCardLabels={getCardLabels} start_time={serverTime} />;
    };
    if (!date_expiry || serverTime.unix() > +date_expiry || isSold) {
        return <CaptionText className='status'>{getCardLabels().CLOSED}</CaptionText>;
    }
    return (
        // TODO: when <Tag /> is exported from quill-ui, use it instead
        <div className='timer'>
            <LabelPairedStopwatchCaptionRegularIcon />
            <CaptionText as='div'>{getDisplayedDuration()}</CaptionText>
        </div>
    );
};
