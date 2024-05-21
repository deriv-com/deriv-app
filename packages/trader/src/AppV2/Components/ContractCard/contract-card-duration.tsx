import React from 'react';
import { TPortfolioPosition } from '@deriv/stores/types';
import { Localize } from '@deriv/translations';
import { CaptionText } from '@deriv-com/quill-ui';
import { LabelPairedStopwatchCaptionRegularIcon } from '@deriv/quill-icons';
import { useStore } from '@deriv/stores';
import { observer } from 'mobx-react';

export type TContractCardDurationProps = Pick<
    TPortfolioPosition['contract_info'],
    'expiry_time' | 'purchase_time' | 'tick_count'
> & {
    currentTick: number | null;
    isMultiplier?: boolean;
};

export const ContractCardDuration = observer(
    ({ currentTick, expiry_time, isMultiplier, purchase_time, tick_count }: TContractCardDurationProps) => {
        const { server_time } = useStore().common;
        return (
            // TODO: when Tag is exported from quill-ui, use <Tag
            //     className='contract-card-duration'
            //     icon={<LabelPairedStopwatchCaptionRegularIcon />}
            //     label={isMultiplier ? <Localize i18n_default_text='Ongoing' /> : 'Duration'}
            // />
            <div className='contract-card-duration'>
                <LabelPairedStopwatchCaptionRegularIcon />
                <CaptionText className='duration'>
                    {/* in progress */}
                    {isMultiplier ? <Localize i18n_default_text='Ongoing' /> : 'Duration'}
                </CaptionText>
            </div>
        );
    }
);
