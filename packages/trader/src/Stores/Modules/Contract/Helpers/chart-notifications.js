import React        from 'react';
import { localize } from 'App/i18n';
import Localize     from '../../../../App/Components/Elements/localize.jsx';

export const switchToTickChart = () => ({
    key    : 'switch_to_tick_chart',
    header : localize('This chart display is not ideal for tick contracts'),
    message: (
        <Localize
            i18n_default_text='Please change the chart duration to tick for a better trading experience.'
        />
    ),
    type: 'info',
});
