import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import cfdAccountDetails from 'Constants/cfd-account-details';


type TCFDAccountTypeDescriptionCard = {
    platform: 'mt5' | 'dxtrade';
    is_eu: boolean;
    account_type: 'synthetic' | 'financial' | 'financial_stp'
};

const CFDAccountTypeDescriptionCard = ({ platform, is_eu, account_type }: TCFDAccountTypeDescriptionCard) => {
    const [cfd_account_details, setCfdAccountDetails] = React.useState({
        title: '',
        description: '',
        leverage: { key: () => '', value: () => '' },
        'margin-call': { key: () => '', value: () => '' },
        'stop-out-level': { key: () => '', value: () => '' },
        'number-of-assets': { key: () => '', value: () => '' },
    });

    React.useEffect(() => {
        if (account_type === 'financial') {
            is_eu
                ? setCfdAccountDetails(cfdAccountDetails[`${platform}`].financial_eu)
                : setCfdAccountDetails(cfdAccountDetails[`${platform}`].financial);
        } else {
            const cfd_account_details =
                platform === 'mt5'
                    ? cfdAccountDetails[`${platform}`][`${account_type}`]
                    : cfdAccountDetails[`${platform}`].synthetic;
            setCfdAccountDetails(cfd_account_details);
        }
    }, [is_eu, platform, account_type]);

    return (
        <>
            <div className='cfd-account-details'>
                <div className='cfd-account-details__title'>{cfd_account_details?.title}</div>
                <div className='cfd-account-details__description'>{cfd_account_details?.description}</div>
                <div className='cfd-account-details__specification'>
                    <div className='cfd-account-details__specification__label'>{cfd_account_details?.leverage.key()}</div>
                    <div className='cfd-account-details__specification__value'>{cfd_account_details?.leverage.value()}</div>
                    <div className='cfd-account-details__specification__label'>{cfd_account_details?.['margin-call'].key()}</div>
                    <div className='cfd-account-details__specification__value'>{cfd_account_details?.['margin-call'].value()}</div>
                    <div className='cfd-account-details__specification__label'>{cfd_account_details?.['stop-out-level'].key()}</div>
                    <div className='cfd-account-details__specification__value'>{cfd_account_details?.['stop-out-level'].value()}</div>
                    <div className='cfd-account-details__specification__label'>{cfd_account_details?.['number-of-assets'].key()}</div>
                    <div className='cfd-account-details__specification__value'>{cfd_account_details?.['number-of-assets'].value()}</div>
                </div>
                <Text className='cfd-account-details__no-commision-block'>
                <Localize i18n_default_text='No commision' />
                    </Text>
            </div>
        </>
    );
};

export default CFDAccountTypeDescriptionCard;
