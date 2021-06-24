import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageList from 'Components/icon-message-list';

const IdvRejected = ({ handleRequireSubmission, rejected_reasons }) => {
    return (
        <div className='proof-of-identity__container'>
            <IconMessageList
                message={localize('Verification of document number failed')}
                icon={<Icon icon='IcPoiFailed' size={128} />}
                message_list={rejected_reasons}
                onContinue={handleRequireSubmission}
                button_text={localize('Try Again')}
            />
        </div>
    );
};

export default IdvRejected;
