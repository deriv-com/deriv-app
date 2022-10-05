import React from 'react';
import { Button, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getAuthenticationStatusInfo } from '@deriv/shared';

import IconMessageContent from 'Components/icon-message-content';

const PoiPoaDocsSubmitted = ({ account_status, is_vanuatu_selected, onClickOK, updateAccountStatus }) => {
    React.useEffect(() => {
        updateAccountStatus();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const message = localize('Your documents were submitted successfully');
    const getDescription = () => {
        const { manual_status, poi_verified_for_vanuatu, poi_verified_for_bvi_labuan_maltainvest, poa_pending } =
            getAuthenticationStatusInfo(account_status);

        if (
            (is_vanuatu_selected && poi_verified_for_vanuatu && poa_pending) ||
            (!is_vanuatu_selected && poi_verified_for_bvi_labuan_maltainvest && poa_pending) ||
            manual_status === 'pending'
        ) {
            return localize('We’ll review your documents and notify you of its status within 1 - 3 working days.');
        }
        return localize('We’ll review your documents and notify you of its status within 5 minutes.');
    };

    return (
        <IconMessageContent
            message={message}
            text={getDescription()}
            icon={<Icon icon='IcDocsSubmit' size={128} />}
            className='poi-poa-submitted'
        >
            <Button has_effect text={localize('OK')} onClick={onClickOK} primary />
        </IconMessageContent>
    );
};
export default PoiPoaDocsSubmitted;
