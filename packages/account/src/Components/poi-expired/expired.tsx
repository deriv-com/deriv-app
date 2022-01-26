import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

type ExpiredProps = {
    handleRequireSubmission: () => void;
    is_from_external: boolean;
    redirect_button: unknown;
};

const Expired = ({ handleRequireSubmission, is_from_external, redirect_button }: ExpiredProps) => {
    return (
        <IconMessageContent
            message={localize('New proof of identity document needed')}
            icon={<Icon icon='IcPoiUpload' size={128} />}
        >
            <Button
                type='button'
                className='account-management__continue'
                onClick={handleRequireSubmission}
                large
                text={localize('Upload Document')}
                primary
            />
            {!is_from_external && redirect_button}
        </IconMessageContent>
    );
};

export default Expired;
