import React from 'react';
import classNames from 'classnames';
import { localize } from '@deriv-com/translations';
import { Tooltip } from '@deriv-com/ui';
import { WalletText } from '../../../../components';
import InfoIcon from '../../../../public/images/ic-info-outline.svg';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS } from '../../constants';
import { getJurisdictionDescription } from './compareAccountsConfig';
import { MARKET_TYPE_SHORTCODE } from './constants';
import './CompareAccountsDescription.scss';

type TCompareAccountsDescription = {
    isDemo: boolean;
    isEuRegion: boolean;
    marketType: THooks.AvailableMT5Accounts['market_type'];
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'];
    shortCode: THooks.AvailableMT5Accounts['shortcode'];
};

const CompareAccountsDescription = ({
    isDemo,
    isEuRegion,
    marketType,
    platform,
    product,
    shortCode,
}: TCompareAccountsDescription) => {
    const marketTypeShortCode =
        platform === CFD_PLATFORMS.MT5 && marketType === 'all'
            ? `${marketType}_${product}_${shortCode}`
            : marketType?.concat('_', shortCode ?? '');
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
                    <div className='wallets-compare-accounts-title__separator'>
                        <WalletText align='center' as='h1' size='xl' weight='bold'>
                            {jurisdictionData.spread}
                        </WalletText>
                        {marketTypeShortCode === MARKET_TYPE_SHORTCODE.ALL_ZERO_SPREAD_BVI && (
                            <Tooltip
                                as='div'
                                data-testid='wallets-compare-accounts-text-container__tooltip'
                                tooltipContent={localize('Commissions apply')}
                                tooltipOffset={20}
                                tooltipPosition='top'
                            >
                                <InfoIcon />
                            </Tooltip>
                        )}
                    </div>
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
