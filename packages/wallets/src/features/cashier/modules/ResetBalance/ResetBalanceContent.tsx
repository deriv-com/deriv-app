import React from 'react';
import { DerivLightDemoResetBalanceIcon, DerivLightDemoResetBalanceSuccessfulIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';

export const getResetBalanceContent = (
    localize: ReturnType<typeof useTranslations>['localize'],
    resetBalance: () => void,
    navigateToTransfer: () => void
) => ({
    resetAvailable: {
        actionButton: (
            <Button borderWidth='sm' onClick={resetBalance} size='lg' textSize='md'>
                <Localize i18n_default_text='Reset balance' />
            </Button>
        ),
        description: localize('Reset your virtual balance to 10,000.00 USD.'),
        icon: <DerivLightDemoResetBalanceIcon height={128} />,
        title: localize('Reset balance'),
    },
    resetUnavailable: {
        actionButton: undefined,
        description: localize('You can reset your balance when it is below USD 10,000.00'),
        icon: <DerivLightDemoResetBalanceIcon height={128} />,
        title: localize('Reset balance unavailable'),
    },
    success: {
        actionButton: (
            <Button borderWidth='sm' onClick={navigateToTransfer} size='lg' textSize='md'>
                <Localize i18n_default_text='Transfer funds' />
            </Button>
        ),
        description: localize('Your balance has been reset to 10,000.00 USD.'),
        icon: <DerivLightDemoResetBalanceSuccessfulIcon height={128} />,
        title: localize('Success'),
    },
});
