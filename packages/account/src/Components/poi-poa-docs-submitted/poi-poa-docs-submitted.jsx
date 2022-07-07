import { Icon, Button } from '@deriv/components';
import { localize } from '@deriv/translations';
import React from 'react';
import { PlatformContext } from '@deriv/shared';
import IconMessageContent from 'Components/icon-message-content';

const PoiPoaSubmitted = ({ onClickOK }) => {
    const { is_appstore } = React.useContext(PlatformContext);
    const message = localize('Your documents was submitted successfully');
    return (
        <IconMessageContent
            message={message}
            text={localize('We’ll review your documents and notify you of its status within 1 to 3 days.')}
            icon={<Icon icon='IcDocsSubmit' size={128} />}
            full_width={is_appstore}
            className='poi-poa-submitted'
        >
            <Button has_effect text={localize('OK')} onClick={onClickOK} primary />
        </IconMessageContent>
    );
};
export default PoiPoaSubmitted;
