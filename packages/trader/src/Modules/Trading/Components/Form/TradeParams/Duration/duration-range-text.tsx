import React from 'react';
import { Text } from '@deriv/components';
import { addComma } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type TDurationRangeText = {
    min: string;
    max: string;
    duration_unit: string;
};

const DurationRangeText = ({ min, max, duration_unit }: TDurationRangeText) => {
    return (
        <Text as='div' size='xxxs' line_height='s' className='range-text-container'>
            <Localize
                i18n_default_text='Range: {{min}} - {{max}} {{duration_unit}} '
                values={{
                    min,
                    max: addComma(max),
                    duration_unit,
                }}
            />
        </Text>
    );
};

export default DurationRangeText;
