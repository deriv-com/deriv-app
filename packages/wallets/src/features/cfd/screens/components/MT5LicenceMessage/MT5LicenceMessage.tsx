import React from 'react';
import { useIsEuRegion } from '@deriv/api-v2';
import { Localize, useTranslations } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { TAvailableMT5Account } from '../../../../../types';
import { getMarketTypeDetails, JURISDICTION, MARKET_TYPE, PlatformDetails } from '../../../constants';
import './MT5LicenceMessage.scss';

type TMT5LicenseMessageProps = {
    account: TAvailableMT5Account;
};

const MT5LicenseMessage: React.FC<TMT5LicenseMessageProps> = ({ account }) => {
    const { isDesktop } = useDevice();
    const { localize } = useTranslations();
    const isSvg = account.shortcode === JURISDICTION.SVG;
    const { data: isEuRegion } = useIsEuRegion();
    const accountName = getMarketTypeDetails(localize, account.product, isEuRegion)[
        account.market_type || MARKET_TYPE.ALL
    ].title;

    return (
        <InlineMessage className='wallets-mt5-licence-message' iconPosition='top' variant='info'>
            <Text align='start' size={isDesktop ? '2xs' : 'xs'}>
                {isSvg ? (
                    // TODO: remove this hardcoded logic for the company number for SVG once BE provides company_number key for non-regulated accounts
                    <Localize
                        i18n_default_text='You are adding your {{accountTitle}} {{accountName}} account under {{companyName}} (company no. 273 LLC 2020).'
                        values={{
                            accountName,
                            accountTitle: PlatformDetails.mt5.title,
                            companyName: account.name,
                        }}
                    />
                ) : (
                    <Localize
                        i18n_default_text='You are adding your {{accountTitle}} {{accountName}} account under {{companyName}}, regulated by the {{regulatoryAuthority}}{{licenceNumber}}.'
                        values={{
                            accountName,
                            accountTitle: PlatformDetails.mt5.title,
                            companyName: account.name,
                            licenceNumber: account.licence_number
                                ? ` (${localize('licence no.')} ${account.licence_number})`
                                : '',
                            regulatoryAuthority: account.regulatory_authority,
                        }}
                    />
                )}
            </Text>
        </InlineMessage>
    );
};

export default MT5LicenseMessage;
