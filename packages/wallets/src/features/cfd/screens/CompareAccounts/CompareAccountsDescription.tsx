import React from 'react';
import classNames from 'classnames';
import { Text } from '@deriv-com/ui';
import { THooks } from '../../../../types';
import { getJurisdictionDescription } from './compareAccountsConfig';
import './CompareAccountsDescription.scss';

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
        <div
            className={classNames('wallets-compare-accounts-text-container', {
                'wallets-compare-accounts-text-container--demo': isDemo,
            })}
        >
            <div className='wallets-compare-accounts-text-container__separator'>
                <Text align='center' as='h1' size='xl' weight='bold'>
                    {'Up to'} {jurisdictionData.leverage}
                </Text>
                <Text align='center' as='p' size='2xs'>
                    {!isEuRegion ? jurisdictionData.leverage_description : 'Leverage'}
                </Text>
            </div>
            {!isEuRegion && (
                <div className='wallets-compare-accounts-text-container__separator'>
                    <Text align='center' as='h1' size='xl' weight='bold'>
                        {jurisdictionData.spread}
                    </Text>
                    <Text align='center' as='p' size='2xs'>
                        {jurisdictionData.spread_description}
                    </Text>
                </div>
            )}
            {!isDemo && (
                <React.Fragment>
                    <div className='wallets-compare-accounts-text-container__separator'>
                        <Text align='center' as='h1' size='sm' weight='bold'>
                            {jurisdictionData.counterparty_company}
                        </Text>
                        <Text align='center' as='p' size='2xs'>
                            {jurisdictionData.counterparty_company_description}
                        </Text>
                    </div>
                    <div className='wallets-compare-accounts-text-container__separator'>
                        <Text align='center' as='h1' size='sm' weight='bold'>
                            {jurisdictionData.jurisdiction}
                        </Text>
                        <Text align='center' as='p' size='2xs'>
                            {jurisdictionData.jurisdiction_description}
                        </Text>
                    </div>
                    <div className='wallets-compare-accounts-text-container__separator'>
                        <Text align='center' as='h1' size='sm' weight='bold'>
                            {jurisdictionData.regulator}
                        </Text>
                        {jurisdictionData.regulator_license && (
                            <Text align='center' as='p' size='2xs'>
                                {jurisdictionData.regulator_license}
                            </Text>
                        )}
                        <Text align='center' as='p' size='2xs'>
                            {jurisdictionData.regulator_description}
                        </Text>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default CompareAccountsDescription;
