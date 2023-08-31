import React from 'react';
import { GetAccountStatus } from '@deriv/api-types';
import { Button, Icon, Loading } from '@deriv/components';
import { useAuthenticationStatusInfo } from '@deriv/hooks';
import { Localize, localize } from '@deriv/translations';
import { Jurisdiction } from '@deriv/shared';
import IconMessageContent from 'Components/icon-message-content';

type TPoiPoaDocsSubmitted = {
    account_status: GetAccountStatus;
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

    const { identity_status, poa, poi, STATUSES } = useAuthenticationStatusInfo();

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
        const { maltainvest, bvi_labuan_vanuatu } = poi;
        const is_maltainvest_selected = jurisdiction_selected_shortcode === Jurisdiction.MALTA_INVEST;
        const check_for_mf = is_maltainvest_selected && maltainvest.verified && poa.status === STATUSES.PENDING;
        const check_for_cr = !is_maltainvest_selected && bvi_labuan_vanuatu.verified && poa.status === STATUSES.PENDING;
        if (check_for_mf || check_for_cr || identity_status.manual === STATUSES.PENDING) {
            return (
                <Localize i18n_default_text='We’ll review your documents and notify you of its status within 1 - 3 working days.' />
            );
        }
        return (
            <Localize i18n_default_text='We’ll review your documents and notify you of its status within 5 minutes.' />
        );
    };
    return is_loading ? (
        <Loading is_fullscreen={false} />
    ) : (
        <IconMessageContent
            message={<Localize i18n_default_text='Your documents were submitted successfully' />}
            text={getDescription()}
            icon={<Icon icon='IcDocsSubmit' size={128} />}
            className='poi-poa-submitted'
        >
            <Button has_effect text={localize('Ok')} onClick={onSubmit} primary />
        </IconMessageContent>
    );
};
export default PoiPoaDocsSubmitted;
