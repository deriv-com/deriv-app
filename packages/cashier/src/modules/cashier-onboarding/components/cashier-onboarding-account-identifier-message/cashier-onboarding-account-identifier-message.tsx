import React from 'react';
import { InlineMessage, Text } from '@deriv/components';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';

const CashierOnboardingAccountIdentifierMessage: React.FC = observer(() => {
    const { ui, client } = useStore();
    const { is_mobile } = ui;
    const { currency, loginid, is_eu, is_crypto, is_low_risk } = client;
    const regulation_text = is_eu ? 'EU ' : 'non-EU ';
    const regulation = is_crypto() || is_low_risk ? '' : regulation_text;

    return (
        <InlineMessage type='information'>
            <Text size={is_mobile ? 'xxxs' : 'xs'}>
                <Localize
                    i18n_default_text='This is your <0>{{regulation}}{{currency}}</0> account {{loginid}}.'
                    values={{ regulation, currency, loginid }}
                    components={[<Text key={0} size={is_mobile ? 'xxxs' : 'xs'} weight='bold' />]}
                />
            </Text>
        </InlineMessage>
    );
});

export default CashierOnboardingAccountIdentifierMessage;
