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
    has_created_account_for_selected_jurisdiction,
    openPasswordModal,
}) => {
    const [is_loading, setIsLoading] = React.useState(false);
    React.useEffect(() => {
        setIsLoading(true);
        updateAccountStatus()
            .then(() => {
                setIsLoading(false);
            })
            .finally(() => setIsLoading(false));
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSubmit = () => {
        onClickOK();
        if (!has_created_account_for_selected_jurisdiction) {
            openPasswordModal();
        }
    };

    const getDescription = () => {
        const { manual_status, poi_verified_for_vanuatu_maltainvest, poi_verified_for_bvi_labuan, poa_pending } =
            getAuthenticationStatusInfo(account_status);
        const is_vanuatu_or_maltainvest_selected =
            jurisdiction_selected_shortcode === 'vanuatu' || jurisdiction_selected_shortcode === 'maltainvest';
        if (
            (is_vanuatu_or_maltainvest_selected && poi_verified_for_vanuatu_maltainvest && poa_pending) ||
            (!is_vanuatu_or_maltainvest_selected && poi_verified_for_bvi_labuan && poa_pending) ||
            manual_status === 'pending'
        ) {
            return localize('We’ll review your documents and notify you of its status within 1 - 3 working days.');
        }
        return localize('We’ll review your documents and notify you of its status within 5 minutes.');
    };
    return is_loading ? (
        <Loading is_fullscreen={false} />
    ) : (
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
