import React from 'react';
import { useActiveAccount } from '@deriv/api-v2';
import { InlineMessage, Text } from '@deriv-com/ui';

const CashierOnboardingAccountIdentifierMessage: React.FC = () => {
    const { data: activeAccount } = useActiveAccount();

    const message = `This is your ${activeAccount?.currency_config?.display_code} account ${activeAccount?.loginid}.`;

    return (
        <InlineMessage type='filled' variant='info'>
            <Text size='xs'>{message}</Text>
        </InlineMessage>
    );
};

export default CashierOnboardingAccountIdentifierMessage;
