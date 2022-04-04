import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import cfd_account_details from 'Constants/cfd-account-type-details';

type TCFDAccountTypeDetailsProps = {
    platform: 'mt5' | 'dxtrade';
    is_eu: boolean;
    account_type: 'synthetic' | 'financial' | 'financial_stp';
};

type TCFDAccountTypeDetails = {
    title: string;
    description: string;
    leverage: { getKey: () => string; getValue: () => string };
    'margin-call': { getKey: () => string; getValue: () => string };
    'stop-out-level': { getKey: () => string; getValue: () => string };
    'number-of-assets': { getKey: () => string; getValue: () => string };
};

const CFDAccountTypeDetails = ({ platform, is_eu, account_type }: TCFDAccountTypeDetailsProps) => {
    const [cfd_account_detail, setCfdAccountDetails] = React.useState<TCFDAccountTypeDetails>();

    React.useEffect(() => {
        if (account_type === 'financial') {
            setCfdAccountDetails(
                is_eu ? cfd_account_details[`${platform}`].financial_eu : cfd_account_details[`${platform}`].financial
            );
        } else {
            setCfdAccountDetails(
                platform === 'mt5'
                    ? cfd_account_details[`${platform}`][`${account_type}`]
                    : cfd_account_details[`${platform}`].synthetic
            );
        }
    }, [is_eu, platform, account_type]);

    return (
        <>
            {cfd_account_detail && (
                <div className='cfd-account-details'>
                    <div className='cfd-account-details__title'>
                        <Text weight='bold' size='xs'>
                            {cfd_account_detail?.title}
                        </Text>
                    </div>
                    <div className='cfd-account-details__description'>
                        <Text size='xs' color='grey-5'>
                            {cfd_account_detail?.description}
                        </Text>
                    </div>
                    <div className='cfd-account-details__specification'>
                        <div className='cfd-account-details__specification__label'>
                            <Text size='xxs'>{cfd_account_detail?.leverage.getKey()}</Text>
                        </div>
                        <div className='cfd-account-details__specification__value'>
                            <Text size='xxs' weight='bold'>
                                {cfd_account_detail?.leverage.getValue()}
                            </Text>
                        </div>
                        <div className='cfd-account-details__specification__label'>
                            <Text size='xxs'>{cfd_account_detail?.['margin-call'].getKey()}</Text>
                        </div>
                        <div className='cfd-account-details__specification__value'>
                            <Text size='xxs' weight='bold'>
                                {cfd_account_detail?.['margin-call'].getValue()}
                            </Text>
                        </div>
                        <div className='cfd-account-details__specification__label'>
                            <Text size='xxs'>{cfd_account_detail?.['stop-out-level'].getKey()}</Text>
                        </div>
                        <div className='cfd-account-details__specification__value'>
                            <Text size='xxs' weight='bold'>
                                {cfd_account_detail?.['stop-out-level'].getValue()}
                            </Text>
                        </div>
                        <div className='cfd-account-details__specification__label'>
                            <Text size='xxs'>{cfd_account_detail?.['number-of-assets'].getKey()}</Text>
                        </div>
                        <div className='cfd-account-details__specification__value'>
                            <Text size='xxs' weight='bold'>
                                {cfd_account_detail?.['number-of-assets'].getValue()}
                            </Text>
                        </div>
                    </div>
                    <Text className='cfd-account-details__no-commision-block'>
                        <Localize i18n_default_text='No commision' />
                    </Text>
                </div>
            )}
        </>
    );
};

export default CFDAccountTypeDetails;
