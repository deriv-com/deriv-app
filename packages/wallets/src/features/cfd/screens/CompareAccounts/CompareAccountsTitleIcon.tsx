import React from 'react';
import { LegacyInfo1pxIcon } from '@deriv/quill-icons';
import { localize, useTranslations } from '@deriv-com/translations';
import { Divider, Text, Tooltip } from '@deriv-com/ui';
import { THooks, TPlatforms } from '../../../../types';
import { CFD_PLATFORMS } from '../../constants';
import { ACCOUNT_ICONS, MT5_PRODUCT } from './constants';
import './CompareAccountsTitleIcon.scss';

type TCompareAccountsTitleIcon = {
    isDemo: boolean;
    isEuRegion: boolean;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'] | 'stp';
};

type TGetAccountIconValues = {
    isEuRegion: boolean;
    platform: TPlatforms.All;
    product?: THooks.AvailableMT5Accounts['product'] | 'stp';
};

type TGetAccountCardTitleValues = {
    isDemo?: boolean;
    isEuRegion: boolean;
    platform: TPlatforms.All;
    product: THooks.AvailableMT5Accounts['product'] | TPlatforms.OtherAccounts | 'stp';
};

const getAccountIcon = (values: TGetAccountIconValues) => {
    const { isEuRegion, platform, product } = values;

    switch (platform) {
        case CFD_PLATFORMS.DXTRADE:
            return ACCOUNT_ICONS[platform];
        case CFD_PLATFORMS.CTRADER:
            return ACCOUNT_ICONS[platform];
        case CFD_PLATFORMS.MT5:
            switch (product) {
                case MT5_PRODUCT.STANDARD:
                    return ACCOUNT_ICONS[MT5_PRODUCT.STANDARD];
                case MT5_PRODUCT.FINANCIAL:
                    return isEuRegion
                        ? ACCOUNT_ICONS[MT5_PRODUCT.FINANCIAL].Eu
                        : ACCOUNT_ICONS[MT5_PRODUCT.FINANCIAL].NonEU;
                case MT5_PRODUCT.STP:
                    return ACCOUNT_ICONS[MT5_PRODUCT.FINANCIAL].NonEU;
                case MT5_PRODUCT.SWAP_FREE:
                    return ACCOUNT_ICONS[MT5_PRODUCT.SWAP_FREE];
                case MT5_PRODUCT.ZERO_SPREAD:
                    return ACCOUNT_ICONS[MT5_PRODUCT.ZERO_SPREAD];
                default:
                    return ACCOUNT_ICONS.default;
            }
        default:
            return ACCOUNT_ICONS.default;
    }
};

const getAccountCardTitle = (values: TGetAccountCardTitleValues) => {
    const { isDemo, isEuRegion, platform, product } = values;

    if (platform === CFD_PLATFORMS.DXTRADE || platform === CFD_PLATFORMS.CTRADER) {
        switch (platform) {
            case CFD_PLATFORMS.DXTRADE:
                return isDemo ? localize('Deriv X Demo') : localize('Deriv X');
            case CFD_PLATFORMS.CTRADER:
                return isDemo ? localize('Deriv cTrader Demo') : localize('Deriv cTrader');
            default:
                return '';
        }
    }

    if (platform === CFD_PLATFORMS.MT5) {
        if (isEuRegion) {
            return isDemo ? localize('CFDs Demo') : localize('CFDs');
        }

        switch (product) {
            case MT5_PRODUCT.STANDARD:
                return isDemo ? localize('Standard Demo') : localize('Standard');
            case MT5_PRODUCT.FINANCIAL:
                return isDemo ? localize('Financial Demo') : localize('Financial');
            case MT5_PRODUCT.STP:
                return localize('Financial - STP');
            case MT5_PRODUCT.SWAP_FREE:
                return isDemo ? localize('Swap-Free Demo') : localize('Swap-Free');
            case MT5_PRODUCT.ZERO_SPREAD:
                return isDemo ? localize('Zero Spread Demo') : localize('Zero Spread');
            default:
                return '';
        }
    }
};

const CompareAccountsTitleIcon = ({ isDemo, isEuRegion, platform, product }: TCompareAccountsTitleIcon) => {
    const { localize } = useTranslations();

    const jurisdictionCardIcon = getAccountIcon({ isEuRegion, platform, product });
    const jurisdictionCardTitle = getAccountCardTitle({ isDemo, isEuRegion, platform, product });
    const labuanJurisdictionMessage = localize(
        'This account gives you direct market price access and tighter spreads.'
    );

    return (
        <React.Fragment>
            <div className='wallets-compare-accounts-title'>
                {jurisdictionCardIcon}
                <div className='wallets-compare-accounts-title__separator'>
                    <Text align='center' as='h1' size='sm' weight='bold'>
                        {jurisdictionCardTitle}
                    </Text>
                    {product === MT5_PRODUCT.STP && (
                        <Tooltip
                            as='div'
                            data-testid='dt_wallets_compare_accounts_title__tooltip'
                            tooltipContainerClassName='wallets-compare-accounts-title__tooltip'
                            tooltipContent={labuanJurisdictionMessage}
                            tooltipPosition='bottom-start'
                        >
                            <LegacyInfo1pxIcon width={16} />
                        </Tooltip>
                    )}
                </div>
            </div>
            <Divider color='var(--general-main-3)' height={0.5} margin='0.4rem 2.8rem' />
        </React.Fragment>
    );
};

export default CompareAccountsTitleIcon;
