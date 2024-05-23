import React from 'react';
import { TPortfolioPosition } from '@deriv/stores/types';
import { Localize } from '@deriv/translations';
import { CaptionText } from '@deriv-com/quill-ui';
import { LabelPairedStopwatchCaptionRegularIcon } from '@deriv/quill-icons';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react';
import { getCardLabels } from '@deriv/shared';
import { RemainingTime } from '@deriv/components';

export type TContractCardDurationProps = Pick<TPortfolioPosition['contract_info'], 'expiry_time' | 'tick_count'> & {
    currentTick?: number | null;
    hasNoAutoExpiry?: boolean;
};

export const ContractCardDuration = observer(
    ({ currentTick, expiry_time, hasNoAutoExpiry, tick_count }: TContractCardDurationProps) => {
        const { server_time } = useStore().common;

        const getDisplayedDuration = () => {
            if (hasNoAutoExpiry) return <Localize i18n_default_text='Ongoing' />;
            if (tick_count && currentTick) {
                return `${currentTick}/${tick_count} ${getCardLabels().TICKS.toLowerCase()}`;
            }
            return <RemainingTime end_time={expiry_time} getCardLabels={getCardLabels} start_time={server_time} />;
        };

        if (!expiry_time) return null;
        return (
            // TODO: when <Tag /> is exported from quill-ui, use it instead
            <div className='contract-card-duration'>
                <LabelPairedStopwatchCaptionRegularIcon />
                <CaptionText as='div' className='duration'>
                    {getDisplayedDuration()}
                </CaptionText>
            </div>
        );
    }
);
