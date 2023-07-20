import React from 'react';
import { Button, Icon, Loading } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Jurisdiction } from '@deriv/shared';
import IconMessageContent from 'Components/icon-message-content';
import { useAuthenticationStatusInfo } from '@deriv/hooks';

type TPoiPoaDocsSubmitted = {
    onClickOK: () => void;
    jurisdiction_selected_shortcode: string;
    has_created_account_for_selected_jurisdiction: boolean;
    openPasswordModal: () => void;
    updateAccountStatus: () => Promise<void>;
};

const PoiPoaDocsSubmitted = ({
    jurisdiction_selected_shortcode,
    onClickOK,
    updateAccountStatus,
    has_created_account_for_selected_jurisdiction,
    openPasswordModal,
}: TPoiPoaDocsSubmitted) => {
    const [is_loading, setIsLoading] = React.useState(false);
    const { poi, poa, identity_status } = useAuthenticationStatusInfo();
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
        const is_maltainvest_selected = jurisdiction_selected_shortcode === Jurisdiction.MALTA_INVEST;
        if (
            (is_maltainvest_selected && poi.maltainvest.verified && poa.pending) ||
            (!is_maltainvest_selected && poi.bvi_labuan_vanuatu.verified && poa.pending) ||
            identity_status.manual === 'pending'
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
