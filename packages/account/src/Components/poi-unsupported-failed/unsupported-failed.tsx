import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

type TUnsupportedFailed = {
    error?: string;
};

const UnsupportedFailed = ({ error }: TUnsupportedFailed) => (
    <IconMessageContent
        message={localize('Proof of identity documents upload failed')}
        text={error}
        icon={<Icon icon='IcPoiFailed' size={128} />}
        className='account-management-dashboard'
    />
);

export default UnsupportedFailed;
