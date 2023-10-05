import React from 'react';
import { Text } from '@deriv/components';
import { idv_error_statuses, TIDVErrorStatus } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import IdvDocumentPending from 'Assets/ic-idv-document-pending.svg';
import PoaButton from 'Components/poa/poa-button';

type TIdvSubmitComplete = {
    is_from_external: boolean;
    mismatch_status: TIDVErrorStatus;
    needs_poa: boolean;
    redirect_button: React.ReactNode;
};

const IdvSubmitComplete = observer(
    ({ is_from_external, mismatch_status, needs_poa, redirect_button }: Partial<TIdvSubmitComplete>) => {
        const { client } = useStore();
        const { account_status } = client;

        const attempt_count = account_status?.authentication?.attempts?.count ?? 0;
        const attempt_history = account_status?.authentication?.attempts?.history ?? [];

        const is_already_attempted = attempt_count > 1 || attempt_history.length > 1;

        const is_mismatch_error =
            mismatch_status === idv_error_statuses.poi_name_dob_mismatch ||
            mismatch_status === idv_error_statuses.poi_dob_mismatch ||
            mismatch_status === idv_error_statuses.poi_name_mismatch;

        const is_expired_or_failed_error =
            mismatch_status === idv_error_statuses.poi_expired || mismatch_status === idv_error_statuses.poi_failed;

        const getHeaderText = () => {
            if (is_already_attempted) {
                if (is_mismatch_error) return <Localize i18n_default_text='Your profile is updated' />;
                if (is_expired_or_failed_error)
                    return <Localize i18n_default_text='Your document has been submitted' />;
            }
            return <Localize i18n_default_text='Your documents were submitted successfully' />;
        };

        const getDescriptionText = () => {
            if (is_already_attempted && (is_mismatch_error || is_expired_or_failed_error))
                return (
                    <Localize i18n_default_text="We'll review your proof of identity again and will give you an update as soon as possible." />
                );
            return (
                <Localize i18n_default_text='We’ll review your documents and notify you of its status within 5 minutes.' />
            );
        };

        const poa_button = !is_from_external && (
            <PoaButton custom_text={<Localize i18n_default_text='Submit proof of address' />} />
        );

        return (
            <div className='proof-of-identity__container'>
                <IdvDocumentPending className='icon' />
                <Text className='proof-of-identity__text btm-spacer' align='center' weight='bold'>
                    {getHeaderText()}
                </Text>
                <Text className='proof-of-identity__text text' size='xs' align='center'>
                    {getDescriptionText()}
                </Text>
                {needs_poa ? (
                    <React.Fragment>
                        <Text className='text' size='xs' align='center'>
                            <Localize i18n_default_text="Next, we'll need your proof of address." />
                        </Text>
                        {poa_button}
                    </React.Fragment>
                ) : (
                    <div className='proof-of-identity__redirection'>{redirect_button}</div>
                )}
            </div>
        );
    }
);

export default React.memo(IdvSubmitComplete);
