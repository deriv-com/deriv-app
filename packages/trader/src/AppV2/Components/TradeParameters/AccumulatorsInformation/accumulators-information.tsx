import React from 'react';
import { observer } from 'mobx-react';
import { Localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { Text } from '@deriv-com/quill-ui';
import { useTraderStore } from 'Stores/useTraderStores';

type TAccumulatorsInformationProps = {
    is_minimized?: boolean;
};

const AccumulatorsInformation = observer(({ is_minimized }: TAccumulatorsInformationProps) => {
    const { currency, maximum_payout } = useTraderStore();

    if (is_minimized) return null;
    return (
        <div className='accumulators-info__wrapper'>
            <Text size='sm' className='accumulators-info__title'>
                <Localize i18n_default_text='Max. payout' />
            </Text>
            <Text size='sm' bold>
                <Money amount={maximum_payout} show_currency currency={currency} />
            </Text>
        </div>
    );
});

export default AccumulatorsInformation;
