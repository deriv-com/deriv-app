import React from 'react';
import classNames from 'classnames';
import { WalletText } from '../../../../components';
import { getJurisdictionDescription } from './compareAccountsConfig';
import { MARKET_TYPE, REGION } from './constants';
import './CompareAccountsDescription.scss';

type TCompareAccountsDescription = {
    isDemo: boolean;
    marketType: typeof MARKET_TYPE[keyof typeof MARKET_TYPE];
    shortCode: string;
};

const CompareAccountsDescription = ({ isDemo, marketType, shortCode }: TCompareAccountsDescription) => {
    const marketTypeShortCode = marketType.concat('_', shortCode);
    const jurisdictionData = getJurisdictionDescription(marketTypeShortCode);
    // const { traders_hub } = useStore();
    // const { selectedRegion } = traders_hub;

    const selectedRegion = 'Non-EU';

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
                    {selectedRegion === REGION.NON_EU ? jurisdictionData.leverage_description : 'Leverage'}
                </WalletText>
            </div>
            {selectedRegion === REGION.NON_EU && (
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
