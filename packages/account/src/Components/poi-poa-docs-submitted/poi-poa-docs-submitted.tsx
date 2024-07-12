import React from 'react';
import { Button, Icon, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getAuthenticationStatusInfo, Jurisdiction } from '@deriv/shared';
import IconMessageContent from 'Components/icon-message-content';
import { GetAccountStatus } from '@deriv/api-types';

type TPoiPoaDocsSubmitted = {
    account_status: GetAccountStatus;
    onClickOK: () => void;
    jurisdiction_selected_shortcode: string;
    has_created_account_for_selected_jurisdiction: boolean;
    openPasswordModal: () => void;
    updateAccountStatus: () => Promise<void>;
};

const PoiPoaDocsSubmitted = ({
    account_status,
    jurisdiction_selected_shortcode,
    onClickOK,
    updateAccountStatus,
    has_created_account_for_selected_jurisdiction,
    openPasswordModal,
}: TPoiPoaDocsSubmitted) => {
    const [is_loading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchAccountStatus = async () => {
            await updateAccountStatus();
            setIsLoading(false);
        };
        setIsLoading(true);
        fetchAccountStatus();

        return () => setIsLoading(false);
    }, [updateAccountStatus]);

    const onSubmit = () => {
        onClickOK();
        if (!has_created_account_for_selected_jurisdiction) {
            openPasswordModal();
        }
    };

    const getDescription = () => {
        const { manual_status, poi_verified_for_maltainvest, poi_verified_for_bvi_labuan_vanuatu, poa_pending } =
            getAuthenticationStatusInfo(account_status);
        const is_maltainvest_selected = jurisdiction_selected_shortcode === Jurisdiction.MALTA_INVEST;
        if (
            (is_maltainvest_selected && poi_verified_for_maltainvest && poa_pending) ||
            (!is_maltainvest_selected && poi_verified_for_bvi_labuan_vanuatu && poa_pending) ||
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
