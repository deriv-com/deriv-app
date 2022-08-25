import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import IconMessageContent from 'Components/icon-message-content';

const PoiPoaDocsSubmitted = ({ onClickOK }) => {
    const message = localize('Your documents were submitted successfully');

    return (
        <IconMessageContent
            message={message}
            text={localize('We’re reviewing your documents. This should take about 5 minutes.')}
            icon={<Icon icon='IcDocsSubmit' size={128} />}
            className='poi-poa-submitted'
        >
            <Button has_effect text={localize('OK')} onClick={onClickOK} primary />
        </IconMessageContent>
    );
};
export default PoiPoaDocsSubmitted;
