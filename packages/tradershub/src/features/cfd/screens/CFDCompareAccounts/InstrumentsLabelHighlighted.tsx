import React from 'react';
import { qtMerge } from '@deriv/quill-design';
import { THooks, TPlatforms } from '../../../../types';
import { getHighlightedIconLabel } from './CompareAccountsConfig';
import InstrumentsIconWithLabel from './InstrumentsIconWithLabel';

type TInstrumentsLabelHighlighted = {
    isDemo: boolean;
    isEuRegion: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const InstrumentsLabelHighlighted = ({
    isDemo,
    isEuRegion,
    marketType,
    platform,
    shortCode,
}: TInstrumentsLabelHighlighted) => {
    const iconData = [...getHighlightedIconLabel(platform, isEuRegion, marketType, shortCode)];

    return (
        <div
            className={qtMerge(
                'flex flex-col rounded-1200 pt-3500 px-[15px] pb-50 lg:pt-2000 lg:px-900 lg:pb-50',
                isDemo && 'pt-800'
            )}
            data-testid='dt_compare_cfd_account_outline__container'
        >
            {iconData.map(item => (
                <InstrumentsIconWithLabel key={item.text} {...item} />
            ))}
        </div>
    );
};

export default InstrumentsLabelHighlighted;
