import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from '../icon-message-content';

type TPOIManualUploadFailed = {
    error?: string;
};
const POIManualUploadFailed = ({ children, error }: React.PropsWithChildren<TPOIManualUploadFailed>) => (
    <IconMessageContent
        message={localize('Proof of identity documents upload failed')}
        text={error}
        icon={<Icon icon='IcPoiFailed' size={128} />}
        className='account-management-dashboard'
    >
        {children && <>{children}</>}
    </IconMessageContent>
);

export default POIManualUploadFailed;
