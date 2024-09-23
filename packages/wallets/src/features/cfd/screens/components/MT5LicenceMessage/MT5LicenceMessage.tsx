import React from 'react';
import { LabelPairedTriangleExclamationMdBoldIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { InlineMessage, Text, useDevice } from '@deriv-com/ui';
import { THooks } from '../../../../../types';
import { getMarketTypeDetails, MARKET_TYPE } from '../../../constants';
import './MT5LicenceMessage.scss';

type TMT5LicenseMessageProps = {
    account: THooks.SortedMT5Accounts;
};

const MT5LicenseMessage: React.FC<TMT5LicenseMessageProps> = ({ account }) => {
    const { isDesktop } = useDevice();

    return (
        <InlineMessage
            className='wallets-mt5-licence-message'
            icon={<LabelPairedTriangleExclamationMdBoldIcon />}
            iconPosition='top'
            variant='info'
        >
            <Text align='start' size={isDesktop ? '2xs' : 'xs'}>
                <Localize
                    i18n_default_text='You are adding your {{accountName}} account under {{companyName}}, regulated by the {{regulatoryAuthority}}{{licenceNumber}}.'
                    values={{
                        accountName: getMarketTypeDetails(account.product)[account.market_type || MARKET_TYPE.ALL]
                            .title,
                        companyName: account.name,
                        licenceNumber: account.licence_number ? ` (licence no. ${account.licence_number})` : '',
                        regulatoryAuthority: account.regulatory_authority,
                    }}
                />
            </Text>
        </InlineMessage>
    );
};

export default MT5LicenseMessage;
