import React from 'react';
import { Text } from '@deriv-app/components';
import { addComma } from '@deriv-app/shared';
import { Localize } from '@deriv-app/translations';

type TDurationRangeText = {
    min: number | null;
    max: number | null;
    duration_unit_text?: string;
};

const DurationRangeText = ({ min, max, duration_unit_text }: TDurationRangeText) => (
    <Text as='div' size='xxxs' line_height='s' className='range-text-container'>
        <Localize
            i18n_default_text='Range: {{min}} - {{max}} {{duration_unit_text}} '
            values={{
                min: addComma(min),
                max: addComma(max),
                duration_unit_text,
            }}
        />
    </Text>
);

export default DurationRangeText;
