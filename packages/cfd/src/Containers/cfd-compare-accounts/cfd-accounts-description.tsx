import React from 'react';
import { Text } from '@deriv/components';
import { TTradingPlatformAvailableAccount } from 'Components/props.types';
import { getJuridisctionDescription } from '../../Helpers/compare-accounts-config';

type TCFDAccountsDescriptionProps = {
    trading_platforms: TTradingPlatformAvailableAccount;
};

const CFDAccountsDescription: React.FC<TCFDAccountsDescriptionProps> = ({ trading_platforms }) => {
    const convert_synthtetic = trading_platforms.market_type === 'gaming' ? 'synthetic' : trading_platforms.market_type;
    const jurisdiction_shortcode = convert_synthtetic.concat('_', trading_platforms.shortcode);
    const response = getJuridisctionDescription(jurisdiction_shortcode);
    return (
        <div className={'compare-cfd-account-text-container'}>
            <div className='compare-cfd-account-text-container__separator'>
                <Text as='h1' weight='bold' size='m' align='center'>
                    {response.leverage}
                </Text>
                <Text as='p' size='xxxs' align='center'>
                    {response.leverageDescription}
                </Text>
            </div>
            <div className='compare-cfd-account-text-container__separator'>
                <Text as='h1' weight='bold' size='m' align='center'>
                    {response.spread}
                </Text>
                <Text as='p' size='xxxs' align='center'>
                    {response.spreadDescription}
                </Text>
            </div>
            <div className='compare-cfd-account-text-container__separator'>
                <Text as='h1' weight='bold' size='xxs' align='center'>
                    {response.counterpartyCompany}
                </Text>
                <Text as='p' size='xxxs' align='center'>
                    {response.counterpartyCompanyDescription}
                </Text>
            </div>
            <div className='compare-cfd-account-text-container__separator'>
                <Text as='h1' weight='bold' size='xxs' align='center'>
                    {response.jurisdiction}
                </Text>
                <Text as='p' size='xxxs' align='center'>
                    {response.jurisdictionDescription}
                </Text>
            </div>
            <div className='compare-cfd-account-text-container__separator'>
                <Text as='h1' weight='bold' size='xxs' align='center'>
                    {response.regulator}
                </Text>
                <Text as='p' size='xxxs' align='center'>
                    {response.regulatorDescription}
                </Text>
            </div>
        </div>
    );
};

export default CFDAccountsDescription;
