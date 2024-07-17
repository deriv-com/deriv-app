import React from 'react';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';

type TMultipliersInformationProps = {
    is_minimized?: boolean;
};

const MultipliersInformation = observer(({ is_minimized }: TMultipliersInformationProps) => {
    const { currency, commission, stop_out } = useTraderStore();
    const content = [
        {
            label: <Localize i18n_default_text='Commission' />,
            value: commission,
        },
        {
            label: <Localize i18n_default_text='Stop out' />,
            value: stop_out,
        },
    ];

    if (is_minimized) return null;

    return (
        <div className='multipliers-info__wrapper'>
            {content.map(({ label, value }) => (
                <div key={label.props.i18n_default_text} className='multipliers-info__row'>
                    <Text size='sm' className='multipliers-info__title'>
                        {label}
                    </Text>
                    <Text size='sm' bold>
                        <Money amount={value} show_currency currency={currency} />
                    </Text>
                </div>
            ))}
        </div>
    );
});

export default MultipliersInformation;
