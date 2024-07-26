import React from 'react';
import { observer } from 'mobx-react';
import { Localize, localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';

type TAccumulatorsInformationProps = {
    is_minimized?: boolean;
};

const AccumulatorsInformation = observer(({ is_minimized }: TAccumulatorsInformationProps) => {
    const { currency, maximum_payout, maximum_ticks } = useTraderStore();
    const content = [
        {
            label: <Localize i18n_default_text='Max. payout' />,
            value: <Money amount={maximum_payout} show_currency currency={currency} />,
        },
        {
            label: <Localize i18n_default_text='Max. ticks' />,
            value: `${maximum_ticks || 0} ${maximum_ticks === 1 ? localize('tick') : localize('ticks')}`,
        },
    ];

    if (is_minimized) return null;

    return (
        <div className='accumulators-info__wrapper'>
            {content.map(({ label, value }) => (
                <div key={label.props.i18n_default_text} className='accumulators-info__row'>
                    <Text size='sm' className='accumulators-info__title'>
                        {label}
                    </Text>
                    <Text size='sm' bold>
                        {value}
                    </Text>
                </div>
            ))}
        </div>
    );
});

export default AccumulatorsInformation;
