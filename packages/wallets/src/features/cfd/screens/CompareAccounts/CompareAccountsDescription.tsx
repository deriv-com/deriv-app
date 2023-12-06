import React from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../components';
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
                <WalletText align='center' as='h1' size='xl' weight='bold'>
                    {'Up to'} {jurisdictionData.leverage}
                </WalletText>
                <WalletText align='center' as='p' size='2xs'>
                    {!isEuRegion ? jurisdictionData.leverage_description : 'Leverage'}
                </WalletText>
            </div>
            {!isEuRegion && (
                <div className='wallets-compare-accounts-text-container__separator'>
                    <WalletText align='center' as='h1' size='xl' weight='bold'>
                        {jurisdictionData.spread}
                    </WalletText>
                    <WalletText align='center' as='p' size='2xs'>
                        {jurisdictionData.spread_description}
                    </WalletText>
                </div>
            )}
            {!isDemo && (
                <React.Fragment>
                    <div className='wallets-compare-accounts-text-container__separator'>
                        <WalletText align='center' as='h1' size='sm' weight='bold'>
                            {jurisdictionData.counterparty_company}
                        </WalletText>
                        <WalletText align='center' as='p' size='2xs'>
                            {jurisdictionData.counterparty_company_description}
                        </WalletText>
                    </div>
                    <div className='wallets-compare-accounts-text-container__separator'>
                        <WalletText align='center' as='h1' size='sm' weight='bold'>
                            {jurisdictionData.jurisdiction}
                        </WalletText>
                        <WalletText align='center' as='p' size='2xs'>
                            {jurisdictionData.jurisdiction_description}
                        </WalletText>
                    </div>
                    <div className='wallets-compare-accounts-text-container__separator'>
                        <WalletText align='center' as='h1' size='sm' weight='bold'>
                            {jurisdictionData.regulator}
                        </WalletText>
                        {jurisdictionData.regulator_license && (
                            <WalletText align='center' as='p' size='2xs'>
                                {jurisdictionData.regulator_license}
                            </WalletText>
                        )}
                        <WalletText align='center' as='p' size='2xs'>
                            {jurisdictionData.regulator_description}
                        </WalletText>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default CompareAccountsDescription;
