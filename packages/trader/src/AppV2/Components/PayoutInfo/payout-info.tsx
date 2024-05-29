import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import React from 'react';
import CardWrapper from 'AppV2/Components/CardWrapper';

const PayoutInfo = () => (
    <CardWrapper title='How do I earn a payout?'>
        <Text size='sm'>
            <Localize i18n_default_text='You will receive a payout at expiry if the spot price never breaches the barrier. The payout is equal to the payout per point multiplied by the distance between the final price and the barrier.' />
        </Text>
    </CardWrapper>
);

export default PayoutInfo;
