import React, { ReactNode } from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import IconMessageContent from '../icon-message-content';

type TPOIManualUploadFailed = {
    error: string;
    message?: ReactNode;
};
const POIManualUploadFailed = ({ children, message, error }: React.PropsWithChildren<TPOIManualUploadFailed>) => (
    <IconMessageContent
        message={message ?? <Localize i18n_default_text={'Proof of identity documents upload failed'} />}
        text={error}
        icon={<Icon icon='IcPoiFailed' size={128} />}
        className='account-management-dashboard'
    >
        {children}
    </IconMessageContent>
);

export default POIManualUploadFailed;
