import React from 'react';
import { Button, Icon, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getAuthenticationStatusInfo } from '@deriv/shared';

import IconMessageContent from 'Components/icon-message-content';

const PoiPoaDocsSubmitted = ({
    account_status,
    jurisdiction_selected_shortcode,
    onClickOK,
    updateAccountStatus,
    hasCreatedAccountForSelectedJurisdiction,
    openPasswordModal,
}) => {
    const [is_loading, setIsLoading] = React.useState(false);
    React.useEffect(() => {
        setIsLoading(true);
        updateAccountStatus().then(() => {
            setIsLoading(false);
        });

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = () => {
        if (hasCreatedAccountForSelectedJurisdiction) {
            onClickOK();
        } else {
            onClickOK();
            openPasswordModal();
        }
    };

    const getDescription = () => {
        const { manual_status, poi_verified_for_vanuatu, poi_verified_for_bvi_labuan_maltainvest, poa_pending } =
            getAuthenticationStatusInfo(account_status);
        const is_vanuatu_selected = jurisdiction_selected_shortcode === 'vanuatu';
        if (
            (is_vanuatu_selected && poi_verified_for_vanuatu && poa_pending) ||
            (!is_vanuatu_selected && poi_verified_for_bvi_labuan_maltainvest && poa_pending) ||
            manual_status === 'pending'
        ) {
            return localize('We’ll review your documents and notify you of its status within 1 - 3 working days.');
        }
        return localize('We’ll review your documents and notify you of its status within 5 minutes.');
    };
    if (is_loading) {
        return <Loading />;
    }
    return (
        <IconMessageContent
            message={localize('Your documents were submitted successfully')}
            text={getDescription()}
            icon={<Icon icon='IcDocsSubmit' size={128} />}
            className='poi-poa-submitted'
        >
            <Button has_effect text={localize('Ok')} onClick={onSubmit} primary />
        </IconMessageContent>
    );
};
export default PoiPoaDocsSubmitted;
