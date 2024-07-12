import React from 'react';
import { Localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';

type TMultipliersInformationProps = {
    is_minimized?: boolean;
} & Pick<ReturnType<typeof useTraderStore>, 'currency' | 'commission' | 'stop_out'>;

const MultipliersInformation = ({ currency, commission, is_minimized, stop_out }: TMultipliersInformationProps) => {
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
        <div className='multipliers__wrapper'>
            {content.map(({ label, value }) => (
                <div key={label.props.i18n_default_text} className='multipliers__row'>
                    <Text size='sm' className='multipliers__title'>
                        {label}
                    </Text>
                    <Text size='sm' bold>
                        <Money amount={value} show_currency currency={currency} />
                    </Text>
                </div>
            ))}
        </div>
    );
};

export default MultipliersInformation;
