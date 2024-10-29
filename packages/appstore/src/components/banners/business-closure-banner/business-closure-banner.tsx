import React from 'react';
import { InlineMessage, Text } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import { formatDate } from '@deriv/shared';
import './business-closure-banner.scss';

const BusinessClosureBanner = observer(() => {
    const { client } = useStore();
    const { is_account_to_be_closed_by_residence, account_time_of_closure, residence } = client;

    if (!is_account_to_be_closed_by_residence) return null;

    return (
        <InlineMessage type='filled' variant='warning' className='business-closure-banner'>
            <Text size='xs'>
                <Localize
                    i18n_default_text='Due to business changes, client accounts in {{residence}} are to be closed. Deposits and trading are disabled. Withdraw your funds by {{date}}.'
                    values={{
                        date: formatDate(account_time_of_closure, 'DD MMM YYYY'),
                        residence: residence
                    }}
                />
            </Text>
        </InlineMessage>
    );
});

export default BusinessClosureBanner;
