import React from 'react';
import { convertTimeFormat, toMoment } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { CaptionText } from '@deriv-com/quill-ui';

type TMarketOpeningTimeBanner = {
    opening_time: string;
    days_offset: number;
    current_language: string;
};

const MarketOpeningTimeBanner = ({ opening_time, days_offset, current_language }: TMarketOpeningTimeBanner) => {
    const formatted_opening_time = convertTimeFormat(opening_time);
    const target_date = toMoment(new Date()).locale(current_language.toLowerCase()).add(days_offset, 'days');
    const opening_date = target_date.format('DD MMM YYYY');

    return (
        <CaptionText bold className='market-opening-time-banner'>
            <Localize
                i18n_default_text='{{formatted_opening_time}} (GMT), {{opening_date}}'
                values={{
                    formatted_opening_time,
                    opening_date,
                }}
            />
        </CaptionText>
    );
};

export default MarketOpeningTimeBanner;
