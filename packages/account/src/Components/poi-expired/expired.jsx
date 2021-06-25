import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const Expired = ({ handleRequireSubmission, redirect_button }) => {
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
            {redirect_button}
        </IconMessageContent>
    );
};

export default Expired;
