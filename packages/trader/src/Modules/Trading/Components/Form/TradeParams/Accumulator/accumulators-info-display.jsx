import React from 'react';
import { localize } from '@deriv/translations';
import Fieldset from 'App/Components/Form/fieldset';
import { Money, Text, Popover } from '@deriv/components';
import classNames from 'classnames';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { isMobile } from '@deriv/shared';

const AccumulatorsInfoDisplay = observer(() => {
    const { currency, maximum_payout, maximum_ticks } = useTraderStore();

    const content = [
        {
            label: localize('Max. payout'),
            value: <Money amount={maximum_payout} show_currency currency={currency} />,
            tooltip_text: localize('Your contract will be automatically closed when your payout reaches this amount.'),
            margin: 143,
        },
        {
            label: localize('Max. ticks'),
            value: `${maximum_ticks || 0} ${maximum_ticks === 1 ? localize('tick') : localize('ticks')}`,
            tooltip_text: localize('Your contract will be automatically closed upon reaching this number of ticks.'),
            margin: 175,
        },
    ];

    return (
        <Fieldset className={classNames('trade-container__fieldset', 'accu-info-display')}>
            {content.map(({ label, value, tooltip_text, margin }) => (
                <div key={label} className='accu-info-display__row'>
                    <Text size='xxs' weight='bold' line_height='xxs'>
                        {label}
                    </Text>
                    <Text size='xxs' align='right' as='div'>
                        <Popover
                            alignment={isMobile() ? 'top' : 'left'}
                            classNameBubble='accu-info-display__popover'
                            is_bubble_hover_enabled
                            message={tooltip_text}
                            margin={isMobile() ? -5 : margin}
                            zIndex='9999'
                        >
                            {value}
                        </Popover>
                    </Text>
                </div>
            ))}
        </Fieldset>
    );
});

export default AccumulatorsInfoDisplay;
