import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import './senegal-business-closure-banner.scss';

const SenegalBusinessClosureBanner = observer(() => {
    const { client } = useStore();
    const { residence } = client;
    // don't forget to change to !==
    if (residence === 'sn') return null;

    return (
        <InlineMessage type='filled' variant='warning' className='senegal-business-closure-banner'>
            <Text size='xs'>
                Due to business changes, client accounts in Senegal are to be closed. Deposits and trading are disabled.
                Withdraw your funds by [DD Mmm YYYY].
            </Text>
        </InlineMessage>
    );
});

export default SenegalBusinessClosureBanner;
