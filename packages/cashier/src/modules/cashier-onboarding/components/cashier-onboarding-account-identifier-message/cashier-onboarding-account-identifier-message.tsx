import React from 'react';
import { InlineMessage } from '@deriv/components';
import { useCurrentCurrencyConfig } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const CashierOnboardingAccountIdentifierMessage: React.FC = observer(() => {
    const { client } = useStore();
    const { loginid } = client;
    const currency_config = useCurrentCurrencyConfig();

    return (
        <InlineMessage
            type='information'
            size='sm'
            message={
                <Localize
                    i18n_default_text='This is your <0>{{currency}}</0> account {{loginid}}.'
                    values={{ currency: currency_config?.display_code, loginid }}
                    components={[<strong key={0} />]}
                />
            }
        />
    );
});

export default CashierOnboardingAccountIdentifierMessage;
