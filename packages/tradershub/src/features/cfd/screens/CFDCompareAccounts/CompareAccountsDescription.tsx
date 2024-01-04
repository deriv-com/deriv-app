import React, { Fragment } from 'react';
import { qtMerge, Text } from '@deriv/quill-design';
import { THooks } from '../../../../types';
import { getJurisdictionDescription } from './CompareAccountsConfig';

type TCompareAccountsDescription = {
    isDemo: boolean;
    isEuRegion: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsDescription = ({ isDemo, isEuRegion, marketType, shortCode }: TCompareAccountsDescription) => {
    const marketTypeShortCode = marketType?.concat('_', shortCode ?? '');
    const jurisdictionData = getJurisdictionDescription(marketTypeShortCode ?? '');

    return (
        <div className={qtMerge('max-h-[210px] lg:max-h-[245px]', isDemo && 'max-h-[9px]')}>
            <div className='m-[9px]'>
                <Text bold size='xl'>
                    {'Up to'} {jurisdictionData.leverage}
                </Text>
                <Text size='sm'>{!isEuRegion ? jurisdictionData.leverage_description : 'Leverage'}</Text>
            </div>
            {!isEuRegion && (
                <div className='m-[9px]'>
                    <Text bold size='xl'>
                        {jurisdictionData.spread}
                    </Text>
                    <Text size='sm'>{jurisdictionData.spread_description}</Text>
                </div>
            )}
            {!isDemo && (
                <Fragment>
                    <div className='m-[9px]'>
                        <Text bold size='sm'>
                            {jurisdictionData.counterparty_company}
                        </Text>
                        <Text size='sm'>{jurisdictionData.counterparty_company_description}</Text>
                    </div>
                    <div className='m-[9px]'>
                        <Text bold size='sm'>
                            {jurisdictionData.jurisdiction}
                        </Text>
                        <Text size='sm'>{jurisdictionData.jurisdiction_description}</Text>
                    </div>
                    <div className='m-[9px]'>
                        <Text bold size='sm'>
                            {jurisdictionData.regulator}
                        </Text>
                        {jurisdictionData.regulator_license && (
                            <Text size='sm'>{jurisdictionData.regulator_license}</Text>
                        )}
                        <Text size='sm'>{jurisdictionData.regulator_description}</Text>
                    </div>
                </Fragment>
            )}
        </div>
    );
};

export default CompareAccountsDescription;
