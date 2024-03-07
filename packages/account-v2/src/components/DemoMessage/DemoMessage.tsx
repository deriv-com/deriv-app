import React from 'react';
import { useAuthorize } from '@deriv/api-v2';
import { DerivLightIcPoaLockIcon } from '@deriv/quill-icons';
import { Button } from '@deriv-com/ui';
import { IconWithMessage } from '../IconWithMessage';

export const DemoMessage = () => {
    const { data: authorizeData } = useAuthorize();
    const hasRealAccount = authorizeData?.account_list?.some(account => account.is_virtual === 0);
    return (
        <IconWithMessage
            actionButton={<Button>{hasRealAccount ? 'Switch to real account' : 'Add a real account'}</Button>}
            icon={<DerivLightIcPoaLockIcon width={128} />}
            title='This feature is not available for demo accounts.'
        />
    );
};
