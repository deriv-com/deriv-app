import React from 'react';
import { clsx } from 'clsx';
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
            className={clsx(
                'flex flex-col rounded-24 pt-[70px] px-[15px] pb-0 lg:pt-40 lg:px-18 lg:pb-0',
                isDemo && 'pt-16'
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
