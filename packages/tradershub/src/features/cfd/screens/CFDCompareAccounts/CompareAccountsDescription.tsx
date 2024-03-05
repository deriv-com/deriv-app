import React, { Fragment } from 'react';
import { useRegulationFlags } from '@/hooks';
import { useActiveTradingAccount } from '@deriv/api';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { getJurisdictionDescription } from './CompareAccountsConfig';

type TCompareAccountsDescription = {
    marketType: THooks.AvailableMT5Accounts['market_type'];
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsDescription = ({ marketType, shortCode }: TCompareAccountsDescription) => {
    const { data: activeTrading } = useActiveTradingAccount();
    const { isEU: isEuRegion } = useRegulationFlags();
    const isDemo = activeTrading?.is_virtual;
    const marketTypeShortCode = marketType?.concat('_', shortCode ?? '');
    const jurisdictionData = getJurisdictionDescription(marketTypeShortCode ?? '');

    return (
        <div className='max-h-[310px] flex flex-col items-center pt-16 gap-5 px-16 lg:px-0'>
            <Text as='p' className='text-default lg:text-xl' weight='bold'>
                {'Up to'} {jurisdictionData.leverage}
            </Text>
            <Text as='p' className='text-xs lg:text-sm'>
                {!isEuRegion ? jurisdictionData.leverage_description : 'Leverage'}
            </Text>
            {!isEuRegion && (
                <Fragment>
                    <Text align='center' as='p' className='text-default lg:text-xl' weight='bold'>
                        {jurisdictionData.spread}
                    </Text>
                    <Text align='center' as='p' className='text-xs lg:text-sm'>
                        {jurisdictionData.spread_description}
                    </Text>
                </Fragment>
            )}
            {!isDemo && (
                <div className='flex flex-col items-center gap-5 lg:gap-7'>
                    <Text as='p' size='sm' weight='bold'>
                        {jurisdictionData.counterparty_company}
                    </Text>
                    <Text as='p' className='text-xs lg:text-sm'>
                        {jurisdictionData.counterparty_company_description}
                    </Text>
                    <Text align='center' as='p' className='text-default lg:text-lg' weight='bold'>
                        {jurisdictionData.jurisdiction}
                    </Text>
                    <Text as='p' size='xs'>
                        {jurisdictionData.jurisdiction_description}
                    </Text>
                    <Text align='center' as='p' className='text-default lg:text-lg' weight='bold'>
                        {jurisdictionData.regulator}
                    </Text>
                    <div>
                        {jurisdictionData.regulator_license && (
                            <Text align='center' as='p' className='text-xs lg:text-sm'>
                                {jurisdictionData.regulator_license}
                            </Text>
                        )}
                        <Text align='center' as='p' className='text-xs lg:text-sm'>
                            {jurisdictionData.regulator_description}
                        </Text>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompareAccountsDescription;
